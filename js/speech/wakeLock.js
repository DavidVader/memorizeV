// Hält den Bildschirm an, bis die zurückgegebene Funktion aufgerufen wird (sofern das Gerät es erlaubt).
export async function keepScreenAwake() {
  if (!('wakeLock' in navigator)) return () => {};

  let lock = null;
  let isReleased = false;

  const acquire = async () => {
    try {
      lock = await navigator.wakeLock.request('screen');
    } catch {
      lock = null;
    }
  };
  const reacquireWhenVisible = () => {
    if (!isReleased && document.visibilityState === 'visible') acquire();
  };

  document.addEventListener('visibilitychange', reacquireWhenVisible);
  await acquire();

  return () => {
    isReleased = true;
    document.removeEventListener('visibilitychange', reacquireWhenVisible);
    lock?.release().catch(() => {});
  };
}
