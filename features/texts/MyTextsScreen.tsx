"use client";

import { getTextStats } from "@/lib/text";
import type { TextItem } from "@/types/learning";
import { ProgressBar } from "@/components/ProgressBar";

export function MyTextsScreen({
  items,
  onOpen,
  onDelete,
}: {
  items: TextItem[];
  onOpen: (item: TextItem) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <main className="screen page-stack">
      <section className="compact-hero">
        <span className="mini-label">Мои тексты</span>
        <h1>Твой прогресс</h1>
        <p>Здесь сохраняются все добавленные тексты и уровень их запоминания.</p>
      </section>
      {items.length === 0 ? (
        <div className="empty-card">
          <div className="empty-icon">✦</div>
          <h2>Пока пусто</h2>
          <p>Добавь первый стих на главной — он появится здесь автоматически.</p>
        </div>
      ) : (
        <div className="text-list">
          {items.map((item) => {
            const stats = getTextStats(item);
            return (
              <article className="saved-card" key={item.id}>
                <button className="saved-main" onClick={() => onOpen(item)}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.author} · {stats.lines} строк</p>
                  </div>
                  <strong>{Math.round(item.mastery)}%</strong>
                </button>
                <ProgressBar value={item.mastery} />
                <div className="saved-actions">
                  <button onClick={() => onOpen(item)}>Продолжить</button>
                  <button className="danger-link" onClick={() => onDelete(item.id)}>Удалить</button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
