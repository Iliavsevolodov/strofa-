"use client";

import { useMemo, useState } from "react";
import { shuffle } from "@/lib/text";
import type { LearningLine } from "@/types/learning";

type Token = { id: string; text: string };

export function AssembleExercise({
  line,
  onDone,
}: {
  line: LearningLine;
  onDone: (correct: boolean) => void;
}) {
  const initial = useMemo(
    () =>
      shuffle(
        line.words.map((text, index) => ({
          id: line.id + "-" + index,
          text,
        })),
      ),
    [line],
  );
  const [bank, setBank] = useState<Token[]>(initial);
  const [assembled, setAssembled] = useState<Token[]>([]);
  const [wrong, setWrong] = useState(false);

  const add = (token: Token) => {
    setAssembled((value) => [...value, token]);
    setBank((value) => value.filter((item) => item.id !== token.id));
    setWrong(false);
  };

  const undo = () => {
    const token = assembled[assembled.length - 1];
    if (!token) return;
    setAssembled((value) => value.slice(0, -1));
    setBank((value) => [...value, token]);
    setWrong(false);
  };

  const check = () => {
    const ok =
      assembled.map((token) => token.text).join(" ") === line.words.join(" ");
    if (!ok) setWrong(true);
    onDone(ok);
  };

  return (
    <div className="exercise">
      <div className="exercise-heading">
        <h2>Собери строку</h2>
        <p>Нажимай слова в правильной последовательности.</p>
      </div>
      <div className="assembly-zone">
        {assembled.length ? (
          assembled.map((token) => <b key={token.id}>{token.text}</b>)
        ) : (
          <span>Здесь появится строка…</span>
        )}
      </div>
      <div className="word-bank">
        {bank.map((token) => (
          <button key={token.id} onClick={() => add(token)}>
            {token.text}
          </button>
        ))}
      </div>
      <div className="choice-row">
        <button className="soft-btn" disabled={!assembled.length} onClick={undo}>
          ← Отменить
        </button>
        <button className="primary-btn" disabled={bank.length > 0} onClick={check}>
          Проверить
        </button>
      </div>
      {wrong && (
        <div className="feedback wrong">
          Порядок пока не совпадает. Отмени несколько слов и попробуй снова.
        </div>
      )}
    </div>
  );
}
