import assert from 'node:assert/strict';
import { test } from 'node:test';
import { StudySession } from '../js/domain/studySession.js';


const cards = [{ id: 1 }, { id: 2 }];

test('starts with the first card hidden', () => {
  const session = new StudySession(cards);
  assert.equal(session.currentCard.id, 1);
  assert.equal(session.isAnswerRevealed, false);
});

test('revealing shows the answer', () => {
  const session = new StudySession(cards);
  session.revealAnswer();
  assert.equal(session.isAnswerRevealed, true);
});

test('an unknown card comes back at the end', () => {
  const session = new StudySession(cards);
  session.markUnknown();
  assert.equal(session.currentCard.id, 2);
  assert.equal(session.masteredCount, 0);
});

test('finishes when every card is known', () => {
  const session = new StudySession(cards);
  session.markKnown();
  session.markKnown();
  assert.equal(session.isFinished, true);
  assert.equal(session.masteredCount, 2);
});

test('the next card starts hidden again', () => {
  const session = new StudySession(cards);
  session.revealAnswer();
  session.markKnown();
  assert.equal(session.isAnswerRevealed, false);
});
