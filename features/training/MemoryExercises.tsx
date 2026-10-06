"use client";

import { useState } from "react";
import { firstLetters, maskLine } from "@/lib/text";
import type { LearningBlock } from "@/types/learning";

type Result = (correct: boolean, usedHint?: boolean) => void;

export function ReadExercise({
  block,
  onDone,
}: {
  block: LearningBlock;
  onDone: Result;
}) {
  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      block.lines.map((line) => line.text).join(" "),
    );
    utterance.lang = "ru-RU";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="exercise">
      <div className="exercise-heading">
        <h2>Прочитай вслух 2 раза</h2>
        <p>Сначала поймай смысл, ритм и последовательность строк.</p>
      </div>
      <div className="poem-card">
        {block.lines.map((line) => <p key={line.id}>{line.text}</p>)}
      </div>
      <button className="audio-btn" onClick={speak}>▶ Послушать фрагмент</button>
      <button className="primary-btn wide" onClick={() => onDone(true)}>
        Готов, идём дальше →
      </button>
    </div>
  );
}

export function FadeExercise({
  block,
  onDone,
}: {
  block: LearningBlock;
  onDone: Result;
}) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="exercise">
      <div className="exercise-heading">
        <h2>Восстанови пропуски в уме</h2>
        <p>Произнеси строки целиком, не подглядывая в оригинал.</p>
      </div>
      <div className="poem-card faded">
        {block.lines.map((line) => (
          <p key={line.id}>{revealed ? line.text : maskLine(line, 0.42)}</p>
        ))}
      </div>
      {!revealed ? (
        <button className="secondary-btn wide" onClick={() => setRevealed(true)}>
          Показать текст
        </button>
      ) : (
        <div className="choice-row">
          <button className="success-btn" onClick={() => onDone(true)}>✓ Вспомнил</button>
          <button className="soft-btn" onClick={() => onDone(false, true)}>↻ Нужно повторить</button>
        </div>
      )}
    </div>
  );
}

export function InitialsExercise({
  block,
  onDone,
}: {
  block: LearningBlock;
  onDone: Result;
}) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="exercise">
      <div className="exercise-heading">
        <h2>Вспомни по первым буквам</h2>
        <p>Минимальная подсказка заставляет память работать активнее.</p>
      </div>
      <div className="poem-card initials">
        {block.lines.map((line) => (
          <p key={line.id}>{revealed ? line.text : firstLetters(line.text)}</p>
        ))}
      </div>
      {!revealed ? (
        <button className="secondary-btn wide" onClick={() => setRevealed(true)}>
          Показать оригинал
        </button>
      ) : (
        <div className="choice-row">
          <button className="success-btn" onClick={() => onDone(true)}>✓ Получилось</button>
          <button className="soft-btn" onClick={() => onDone(false, true)}>↻ Было сложно</button>
        </div>
      )}
    </div>
  );
}

export function RecallExercise({
  block,
  onDone,
}: {
  block: LearningBlock;
  onDone: Result;
}) {
  const [hint, setHint] = useState(0);
  const first = block.lines[0];

  return (
    <div className="exercise">
      <div className="exercise-heading">
        <h2>Расскажи без текста</h2>
        <p>Произнеси весь блок. Подсказку открывай только если застрял.</p>
      </div>
      <div className="recall-space">
        {hint === 0 && <div><span className="recall-icon">🎙</span><strong>Экран чистый — рассказывай</strong></div>}
        {hint === 1 && <p>{firstLetters(first.text)}</p>}
        {hint === 2 && <p>{first.words.slice(0, 2).join(" ")}…</p>}
        {hint === 3 && <p>{first.text}</p>}
        {hint >= 4 && block.lines.map((line) => <p key={line.id}>{line.text}</p>)}
      </div>
      <button
        className="secondary-btn wide"
        disabled={hint >= 4}
        onClick={() => setHint((value) => Math.min(4, value + 1))}
      >
        {hint === 0 ? "Нужна подсказка" : "Ещё подсказка"}
      </button>
      <div className="choice-row">
        <button className="success-btn" onClick={() => onDone(true, hint > 0)}>✓ Рассказал</button>
        <button className="soft-btn" onClick={() => onDone(false, true)}>↻ Забыл</button>
      </div>
    </div>
  );
}
