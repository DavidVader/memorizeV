// Verschieben per Drag & Drop wie in iOS: Zeile gedrückt halten, dann ziehen.
// - Zwischen zwei Zeilen loslassen: sortiert dort ein.
// - Auf die Mitte eines Ordners loslassen: verschiebt hinein.
// - Auf die Leiste oben loslassen: verschiebt eine Ebene nach oben.
//
// Zeilen tragen data-drag-kind ("folder" oder "card") und data-drag-id.
// Zeilen mit data-drop-fixed sind nicht verschiebbar. Teile mit data-no-drag starten kein Ziehen.
const LONG_PRESS_MS = 350;
const MOVE_TOLERANCE_PX = 8;
const EDGE_SCROLL_ZONE_PX = 70;
const EDGE_SCROLL_STEP_PX = 14;
const INTO_ZONE = { start: 0.25, end: 0.75 };
const VIBRATION_MS = 10;
const CLICK_GUARD_MS = 300;

export function enableDragAndDrop(screen, { canDropInto, upTarget, onDrop }) {
  let press = null;
  let drag = null;

  screen.querySelectorAll('[data-drag-id]').forEach((item) => {
    item.addEventListener('pointerdown', (event) => startPress(event, item));
  });
  // Solange gezogen wird, darf die Seite nicht mitscrollen (iOS braucht den Listener schon vor dem Berühren).
  screen.addEventListener('touchmove', (event) => drag && event.preventDefault(), { passive: false });

  function startPress(event, item) {
    if (press || drag) return;
    if (event.target.closest('[data-no-drag]')) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    press = { item, startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY };
    press.timer = setTimeout(beginDrag, LONG_PRESS_MS);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerCancel);
  }

  function onPointerMove(event) {
    if (press) {
      press.x = event.clientX;
      press.y = event.clientY;
    }
    if (drag) return moveDrag(event.clientX, event.clientY);
    const distance = Math.hypot(event.clientX - press.startX, event.clientY - press.startY);
    if (distance > MOVE_TOLERANCE_PX) endGesture();
  }

  function onPointerUp() {
    const finishedDrag = drag;
    const target = finishedDrag?.target;
    endGesture();
    if (finishedDrag && target) onDrop({ kind: finishedDrag.kind, id: finishedDrag.id, target });
  }

  function onPointerCancel() {
    endGesture();
  }

  function beginDrag() {
    const { item } = press;
    const rect = item.getBoundingClientRect();
    const kind = item.dataset.dragKind;
    const up = upTarget(kind);

    drag = {
      item,
      kind,
      id: item.dataset.dragId,
      target: null,
      highlighted: null,
      grabOffsetY: press.y - rect.top,
      ghost: createGhost(item, rect),
      upBar: up ? createUpBar(up.label) : null,
      scrollFrame: requestAnimationFrame(autoScroll),
    };
    item.classList.add('drag-source');
    document.body.classList.add('is-dragging');
    navigator.vibrate?.(VIBRATION_MS);
    moveDrag(press.x, press.y);
  }

  function moveDrag(x, y) {
    drag.pointerX = x;
    drag.pointerY = y;
    drag.ghost.style.top = `${y - drag.grabOffsetY}px`;
    updateTarget();
  }

  function updateTarget() {
    const target = findTarget(drag, drag.pointerX, drag.pointerY, canDropInto);
    drag.target = target?.descriptor ?? null;
    highlight(drag, target);
  }

  function autoScroll() {
    if (!drag) return;
    if (drag.pointerY < EDGE_SCROLL_ZONE_PX) window.scrollBy(0, -EDGE_SCROLL_STEP_PX);
    else if (drag.pointerY > window.innerHeight - EDGE_SCROLL_ZONE_PX) window.scrollBy(0, EDGE_SCROLL_STEP_PX);
    updateTarget();
    drag.scrollFrame = requestAnimationFrame(autoScroll);
  }

  function endGesture() {
    clearTimeout(press?.timer);
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    document.removeEventListener('pointercancel', onPointerCancel);

    if (drag) {
      cancelAnimationFrame(drag.scrollFrame);
      clearHighlight(drag);
      drag.ghost.remove();
      drag.upBar?.remove();
      drag.item.classList.remove('drag-source');
      document.body.classList.remove('is-dragging');
      swallowNextClick();
    }
    press = null;
    drag = null;
  }
}

// Liefert { descriptor, row, position } oder null, wenn hier nicht abgelegt werden kann.
function findTarget(drag, x, y, canDropInto) {
  const hit = document.elementFromPoint(x, y);
  if (!hit) return null;
  if (drag.upBar?.contains(hit)) return { descriptor: { type: 'up' }, upBar: drag.upBar };

  const row = hit.closest('[data-drag-id]');
  if (!row || row === drag.item) return null;

  const rect = row.getBoundingClientRect();
  const ratio = (y - rect.top) / rect.height;
  const isFolder = row.dataset.dragKind === 'folder';
  const isInside = ratio > INTO_ZONE.start && ratio < INTO_ZONE.end;

  if (isFolder && isInside) {
    return canDropInto(drag.kind, drag.id, row.dataset.dragId)
      ? { descriptor: { type: 'into', folderId: row.dataset.dragId }, row, position: 'into' }
      : null;
  }
  if (row.dataset.dragKind !== drag.kind) return null;

  const position = ratio < 0.5 ? 'above' : 'below';
  const beforeId = position === 'above' ? row.dataset.dragId : idOfNextRow(row, drag.item);
  return { descriptor: { type: 'before', beforeId }, row, position };
}

function idOfNextRow(row, draggedItem) {
  let next = row.nextElementSibling;
  if (next === draggedItem) next = next.nextElementSibling;
  return next?.dataset.dragId ?? null;
}

function highlight(drag, target) {
  clearHighlight(drag);
  if (!target) return;
  const element = target.upBar ?? target.row;
  const className = target.upBar ? 'is-active' : `drop-${target.position}`;
  element.classList.add(className);
  drag.highlighted = { element, className };
}

function clearHighlight(drag) {
  drag.highlighted?.element.classList.remove(drag.highlighted.className);
  drag.highlighted = null;
}

function createGhost(item, rect) {
  const ghost = item.cloneNode(true);
  ghost.classList.add('drag-ghost');
  Object.assign(ghost.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px` });
  document.body.append(ghost);
  return ghost;
}

function createUpBar(label) {
  const bar = document.createElement('div');
  bar.className = 'drag-up-bar';
  bar.textContent = `↑ ${label}`;
  document.body.append(bar);
  return bar;
}

// Nach dem Loslassen löst der Browser noch einen Klick aus; der darf die Zeile nicht öffnen.
function swallowNextClick() {
  const swallow = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };
  document.addEventListener('click', swallow, { capture: true, once: true });
  setTimeout(() => document.removeEventListener('click', swallow, { capture: true }), CLICK_GUARD_MS);
}
