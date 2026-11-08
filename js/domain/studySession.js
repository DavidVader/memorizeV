export class StudySession {
  #queue;
  #total;
  #mastered = 0;
  #answerRevealed = false;

  constructor(orderedCards) {
    this.#queue = [...orderedCards];
    this.#total = orderedCards.length;
  }

  get isFinished() {
    return this.#queue.length === 0;
  }

  get currentCard() {
    return this.#queue[0];
  }

  get isAnswerRevealed() {
    return this.#answerRevealed;
  }

  get masteredCount() {
    return this.#mastered;
  }

  get totalCount() {
    return this.#total;
  }

  revealAnswer() {
    this.#answerRevealed = true;
  }

  markKnown() {
    this.#queue.shift();
    this.#mastered += 1;
    this.#answerRevealed = false;
  }

  markUnknown() {
    this.#queue.push(this.#queue.shift());
    this.#answerRevealed = false;
  }
}
