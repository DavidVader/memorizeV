const DELIMITERS = ['\t', ';'];
const END_MARKER = '#';
const BYTE_ORDER_MARK = '﻿';

export function parseCards(text) {
  const lines = contentLines(text);
  const delimiter = delimiterOf(lines[0]);
  return delimiter
    ? lines.map((line) => parseDelimitedLine(line, delimiter)).filter(Boolean)
    : parseAlternatingLines(lines);
}

export function serializeCards(cards) {
  if (cards.length === 0) return '';
  const lines = cards.map((card) => `${flatten(card.question)}\t${flatten(card.answer)}`);
  return `${lines.join('\n')}\n`;
}

function contentLines(text) {
  const lines = text.replace(BYTE_ORDER_MARK, '').split(/\r?\n/).map((line) => line.trim());
  const endIndex = lines.indexOf(END_MARKER);
  const beforeEnd = endIndex === -1 ? lines : lines.slice(0, endIndex);
  return beforeEnd.filter((line) => line !== '');
}

function delimiterOf(line = '') {
  return DELIMITERS.find((candidate) => line.includes(candidate));
}

function parseDelimitedLine(line, delimiter) {
  if (!line.includes(delimiter)) return null;
  const splitAt = line.indexOf(delimiter);
  return toCard(line.slice(0, splitAt), line.slice(splitAt + 1));
}

function parseAlternatingLines(lines) {
  const cards = [];
  for (let index = 0; index + 1 < lines.length; index += 2) {
    cards.push(toCard(lines[index], lines[index + 1]));
  }
  return cards.filter(Boolean);
}

function toCard(question, answer) {
  const card = { question: question.trim(), answer: answer.trim() };
  return card.question && card.answer ? card : null;
}

function flatten(text) {
  return text.replace(/\s*[\r\n\t]+\s*/g, ' ').trim();
}
