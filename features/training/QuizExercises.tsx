"use client";

import { useMemo, useState } from "react";
import { shuffle } from "@/lib/text";
import type { LearningLine } from "@/types/learning";

const clean = (word: string) =>
  word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");

export function MissingWordExercise({
  line,
  allLines,
  onDone,
}: {
  line: LearningLine;
  allLines: LearningLine[];
  onDone: (correct: boolean) => void;
}) {
  const [wrong, setWrong] = useState(false);
  const exercise = useMemo(() => {
    const wordIndex = Math.min(
      line.words.length - 1,
      Math.max(0, Math.floor(line.words.length / 2)),
    );
    const answer = line.words[wordIndex];
    const distractors = shuffle(
      allLines
        .flatMap((candidate) => candidate.words)
        .filter((word) => clean(word) && clean(word) !== clean(answer)),
    )
      .filter(
        (word, index, source) =>
          source.findIndex((candidate) => clean(candidate) === clean(word)) === index,
      )
      .slice(0, 3);

    return {
      answer,
      visible: line.words
        .map((word, index) => (index === wordIndex ? "_____" : word))
        .join(" "),
      options: shuffle([answer, ...distractors]),
    };
  }, [line, allLines]);

  return (
    <div className="exercise">
      <div className="exercise-heading">
        <h2>Какого слова не хватает?</h2>
        <p>Восстанови исходную строку по смыслу и ритму.</p>
      </div>
      <div className="single-line">{exercise.visible}</div>
      <div className="answer-grid">
        {exercise.options.map((option, index) => (
          <button
            className="answer"
            key={option + index}
            onClick={() => {
              const ok = option === exercise.answer;
              if (!ok) setWrong(true);
              onDone(ok);
            }}
          >
            {option}
          </button>
        ))}
      </div>
      {wrong && <div className="feedback wrong">Не совсем. Попробуй ещё раз.</div>}
    </div>
  );
}

export function NextLineExercise({
  line,
  allLines,
  onDone,
}: {
  line: LearningLine;
  allLines: LearningLine[];
  onDone: (correct: boolean) => void;
}) {
  const [wrong, setWrong] = useState(false);
  const exercise = useMemo(() => {
    const index = allLines.findIndex((candidate) => candidate.id === line.id);
    const answer = allLines[index + 1] ?? allLines[0];
    const distractors = shuffle(
      allLines.filter(
        (candidate) => candidate.id !== line.id && candidate.id !== answer.id,
      ),
    ).slice(0, 3);

    return { answer, options: shuffle([answer, ...distractors]) };
  }, [line, allLines]);

  return (
    <div className="exercise">
      <div className="exercise-heading">
        <h2>Какая строка идёт дальше?</h2>
        <p>Тренируем переходы, чтобы не теряться во время рассказа.</p>
      </div>
      <div className="single-line prompt-line">{line.text}</div>
      <div className="answer-stack">
        {exercise.options.map((option) => (
          <button
            className="answer"
            key={option.id}
            onClick={() => {
              const ok = option.id === exercise.answer.id;
              if (!ok) setWrong(true);
              onDone(ok);
            }}
          >
            {option.text}
          </button>
        ))}
      </div>
      {wrong && <div className="feedback wrong">Не эта строка. Вспомни продолжение по смыслу.</div>}
    </div>
  );
}
