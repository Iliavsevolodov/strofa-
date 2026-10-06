"use client";

import { useState } from "react";
import { DEMO_TEXTS } from "@/data/demo";
import { createTextItem, getTextStats } from "@/lib/text";
import type { TextItem } from "@/types/learning";

export function HomeScreen({
  items,
  onCreate,
  onOpen,
}: {
  items: TextItem[];
  onCreate: (item: TextItem) => void;
  onOpen: (item: TextItem) => void;
}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);

  const submit = () => {
    if (!content.trim()) return;
    const item = createTextItem({ title, author, content });
    onCreate(item);
    setTitle("");
    setAuthor("");
    setContent("");
  };

  return (
    <main className="screen page-stack">
      <section className="hero">
        <div className="eyebrow">Запоминание без зубрёжки</div>
        <h1>Выучи любой текст <span>легко</span></h1>
        <p>
          Вставь стих — СТРОФА разобьёт его на части и проведёт через короткие
          упражнения до уверенного воспроизведения.
        </p>
        <div className="hero-actions">
          <button className="primary-btn" onClick={() => setShowForm(true)}>
            + Вставить свой текст
          </button>
          <button
            className="secondary-btn"
            onClick={() => {
              const demo = createTextItem(DEMO_TEXTS[0]);
              onCreate(demo);
            }}
          >
            Попробовать на «Бородино»
          </button>
        </div>
      </section>

      {showForm && (
        <section className="card form-card">
          <div className="section-heading">
            <div>
              <span className="mini-label">Новый текст</span>
              <h2>Что будем учить?</h2>
            </div>
            <button className="icon-btn" onClick={() => setShowForm(false)} aria-label="Закрыть">×</button>
          </div>
          <div className="field-grid">
            <label>
              <span>Название</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Например, Бородино" />
            </label>
            <label>
              <span>Автор</span>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="М. Ю. Лермонтов" />
            </label>
          </div>
          <label>
            <span>Текст</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={"Вставьте стихотворение или любой текст…\n\nПустая строка отделяет строфы."}
              rows={10}
            />
          </label>
          <div className="form-footer">
            <span>{content.trim() ? content.trim().split(/\s+/).length : 0} слов</span>
            <button className="primary-btn" disabled={!content.trim()} onClick={submit}>
              Создать тренировку →
            </button>
          </div>
        </section>
      )}

      {items.length > 0 && (
        <section>
          <div className="section-heading">
            <div>
              <span className="mini-label">Продолжить</span>
              <h2>Недавние тексты</h2>
            </div>
          </div>
          <div className="text-grid">
            {items.slice(0, 3).map((item) => {
              const stats = getTextStats(item);
              return (
                <button key={item.id} className="text-card" onClick={() => onOpen(item)}>
                  <div className="text-card-top">
                    <span className="pill">{stats.difficulty}</span>
                    <strong>{Math.round(item.mastery)}%</strong>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.author}</p>
                  <div className="text-meta">{stats.lines} строк · ~{stats.minutes} мин</div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <div className="section-heading">
          <div>
            <span className="mini-label">Начать сразу</span>
            <h2>Из библиотеки</h2>
          </div>
        </div>
        <div className="text-grid">
          {DEMO_TEXTS.map((demo) => (
            <button
              key={demo.title}
              className="text-card"
              onClick={() => onCreate(createTextItem(demo))}
            >
              <span className="pill">Классика</span>
              <h3>{demo.title}</h3>
              <p>{demo.author}</p>
              <div className="text-meta">Создать тренировку →</div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
