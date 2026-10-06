"use client";

import { DEMO_TEXTS } from "@/data/demo";
import { createTextItem } from "@/lib/text";
import type { TextItem } from "@/types/learning";

export function LibraryScreen({ onCreate }: { onCreate: (item: TextItem) => void }) {
  return (
    <main className="screen page-stack">
      <section className="compact-hero">
        <span className="mini-label">Библиотека</span>
        <h1>Тексты для тренировки</h1>
        <p>В MVP здесь собраны произведения общественного достояния. Любой свой текст можно добавить с главной.</p>
      </section>
      <div className="text-grid">
        {DEMO_TEXTS.map((demo) => (
          <button key={demo.title} className="text-card" onClick={() => onCreate(createTextItem(demo))}>
            <span className="pill">Русская классика</span>
            <h3>{demo.title}</h3>
            <p>{demo.author}</p>
            <div className="text-meta">Учить →</div>
          </button>
        ))}
      </div>
    </main>
  );
}
