"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { getTextStats } from "@/lib/text";
import type { ExerciseType, LearningLine, TextItem } from "@/types/learning";
import {
  FadeExercise,
  InitialsExercise,
  ReadExercise,
  RecallExercise,
} from "./MemoryExercises";
import { MissingWordExercise, NextLineExercise } from "./QuizExercises";
import { AssembleExercise } from "./AssembleExercise";

const STAGES: Array<{ id: ExerciseType; label: string }> = [
  { id: "read", label: "Прочитай" },
  { id: "fade", label: "Вспомни" },
  { id: "missing", label: "Вставь слово" },
  { id: "assemble", label: "Собери строку" },
  { id: "next-line", label: "Что дальше?" },
  { id: "first-letters", label: "По буквам" },
  { id: "recall", label: "Без подсказки" },
];

export function TrainingScreen({
  item,
  onUpdate,
  onBack,
}: {
  item: TextItem;
  onUpdate: (item: TextItem) => void;
  onBack: () => void;
}) {
  const [phase, setPhase] = useState<"intro" | "session" | "done">("intro");
  const [blockIndex, setBlockIndex] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);

  const stats = getTextStats(item);
  const block = item.blocks[blockIndex] ?? item.blocks[0];
  const stage = STAGES[stageIndex]?.id ?? "read";
  const focusLine = block?.lines[0];

  const allLines = useMemo(
    () => item.blocks.flatMap((candidate) => candidate.lines),
    [item],
  );

  const updateLine = (
    line: LearningLine | undefined,
    correct: boolean,
    usedHint = false,
  ) => {
    if (!line) return;

    const blocks = item.blocks.map((candidateBlock) => {
      const lines = candidateBlock.lines.map((candidateLine) => {
        if (candidateLine.id !== line.id) return candidateLine;
        const delta = correct ? (usedHint ? 6 : 12) : -5;
        return {
          ...candidateLine,
          mastery: Math.max(0, Math.min(100, candidateLine.mastery + delta)),
          correctAttempts: candidateLine.correctAttempts + (correct ? 1 : 0),
          incorrectAttempts: candidateLine.incorrectAttempts + (correct ? 0 : 1),
          hintCount: candidateLine.hintCount + (usedHint ? 1 : 0),
          lastReviewedAt: new Date().toISOString(),
        };
      });

      const mastery =
        lines.reduce((sum, current) => sum + current.mastery, 0) /
        Math.max(1, lines.length);

      return { ...candidateBlock, lines, mastery };
    });

    const flat = blocks.flatMap((candidate) => candidate.lines);
    const mastery =
      flat.reduce((sum, current) => sum + current.mastery, 0) /
      Math.max(1, flat.length);

    onUpdate({
      ...item,
      blocks,
      mastery,
      progress: mastery,
      updatedAt: new Date().toISOString(),
    });
  };

  const advance = () => {
    if (stageIndex < STAGES.length - 1) {
      setStageIndex((value) => value + 1);
      return;
    }

    if (blockIndex < item.blocks.length - 1) {
      setBlockIndex((value) => value + 1);
      setStageIndex(0);
      return;
    }

    setPhase("done");
  };

  const quizResult = (correct: boolean, usedHint = false) => {
    updateLine(focusLine, correct, usedHint);
    if (correct) window.setTimeout(advance, 220);
  };

  const selfResult = (correct: boolean, usedHint = false) => {
    updateLine(focusLine, correct, usedHint);
    advance();
  };

  if (!item.blocks.length) {
    return (
      <main className="screen page-stack">
        <button className="back-link" onClick={onBack}>← Назад</button>
        <div className="empty-card">
          <div className="empty-icon">!</div>
          <h2>Не удалось разобрать текст</h2>
          <p>Добавь хотя бы одну непустую строку.</p>
        </div>
      </main>
    );
  }

  if (phase === "intro") {
    return (
      <main className="screen training-shell page-stack">
        <button className="back-link" onClick={onBack}>← На главную</button>
        <section className="training-intro card">
          <span className="pill">Тренировка готова</span>
          <h1>{item.title}</h1>
          <p className="author">{item.author}</p>

          <div className="stats-row">
            <div><strong>{stats.lines}</strong><span>строк</span></div>
            <div><strong>{stats.blocks}</strong><span>блоков</span></div>
            <div><strong>~{stats.minutes}</strong><span>минут</span></div>
            <div><strong>{stats.difficulty}</strong><span>сложность</span></div>
          </div>

          <div className="intro-note">
            <strong>Как будем учить</strong>
            <p>
              Прочитаем → уберём подсказки → восстановим слова →
              соберём строку → попробуем рассказать самостоятельно.
            </p>
          </div>

          <button className="primary-btn wide" onClick={() => setPhase("session")}>
            Начать обучение →
          </button>
        </section>
      </main>
    );
  }

  if (phase === "done") {
    const weakest = [...allLines]
      .sort((a, b) => a.mastery - b.mastery)
      .slice(0, Math.min(3, allLines.length));

    return (
      <main className="screen training-shell page-stack">
        <section className="complete-card card">
          <div className="celebrate">✦</div>
          <span className="mini-label">Тренировка завершена</span>
          <h1>Отличная работа</h1>
          <p>
            Ты прошёл все блоки «{item.title}». Теперь закрепи самые сложные
            переходы и строки.
          </p>
          <div className="big-score">{Math.round(item.mastery)}%</div>
          <ProgressBar value={item.mastery} />

          <div className="weak-box">
            <strong>Сложные места</strong>
            {weakest.map((line) => (
              <p key={line.id}>«{line.text}» · {Math.round(line.mastery)}%</p>
            ))}
          </div>

          <div className="hero-actions">
            <button
              className="primary-btn"
              onClick={() => {
                setBlockIndex(0);
                setStageIndex(4);
                setPhase("session");
              }}
            >
              Повторить сложное
            </button>
            <button className="secondary-btn" onClick={onBack}>К моим текстам</button>
          </div>
        </section>
      </main>
    );
  }

  const progress =
    ((blockIndex * STAGES.length + stageIndex) /
      Math.max(1, item.blocks.length * STAGES.length)) *
    100;

  return (
    <main className="screen training-shell">
      <header className="training-header">
        <button className="icon-btn" onClick={onBack} aria-label="Закрыть">×</button>
        <div className="training-progress">
          <div className="training-title-row">
            <strong>{item.title}</strong>
            <span>Блок {blockIndex + 1} из {item.blocks.length}</span>
          </div>
          <ProgressBar value={progress} />
        </div>
        <span className="stage-counter">{stageIndex + 1}/{STAGES.length}</span>
      </header>

      <section className="lesson-card">
        <div className="lesson-kicker">
          <span>{STAGES[stageIndex].label}</span>
          <span>🧠 {Math.round(item.mastery)}%</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={stage + "-" + blockIndex}
            initial={{ opacity: 0, y: 9 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -7 }}
            transition={{ duration: 0.18 }}
          >
            {stage === "read" && <ReadExercise block={block} onDone={advance} />}
            {stage === "fade" && <FadeExercise block={block} onDone={selfResult} />}
            {stage === "missing" && focusLine && (
              <MissingWordExercise line={focusLine} allLines={allLines} onDone={quizResult} />
            )}
            {stage === "assemble" && focusLine && (
              <AssembleExercise line={focusLine} onDone={quizResult} />
            )}
            {stage === "next-line" && focusLine && (
              <NextLineExercise line={focusLine} allLines={allLines} onDone={quizResult} />
            )}
            {stage === "first-letters" && (
              <InitialsExercise block={block} onDone={selfResult} />
            )}
            {stage === "recall" && (
              <RecallExercise block={block} onDone={selfResult} />
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  );
}
