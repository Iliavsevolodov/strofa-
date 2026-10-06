"use client";

import { useEffect, useMemo, useState } from "react";
import { APP_CONFIG } from "@/lib/config";
import { loadState, saveState, type StrofaState } from "@/lib/storage";
import type { TextItem } from "@/types/learning";
import { BottomNav, type AppTab } from "@/components/BottomNav";
import { HomeScreen } from "@/features/home/HomeScreen";
import { LibraryScreen } from "@/features/library/LibraryScreen";
import { MyTextsScreen } from "@/features/texts/MyTextsScreen";
import { TrainingScreen } from "@/features/training/TrainingScreen";

const emptyState: StrofaState = { items: [], theme: "light" };

export default function Home() {
  const [state, setState] = useState<StrofaState>(emptyState);
  const [tab, setTab] = useState<AppTab>("home");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const next = loadState();
    setState(next);
    document.documentElement.dataset.theme = next.theme;
    setHydrated(true);
  }, []);

  const commit = (next: StrofaState) => {
    setState(next);
    saveState(next);
    document.documentElement.dataset.theme = next.theme;
  };

  const activeItem = useMemo(
    () => state.items.find((item) => item.id === state.activeTextId),
    [state.items, state.activeTextId],
  );

  const create = (item: TextItem) => {
    commit({
      ...state,
      items: [item, ...state.items],
      activeTextId: item.id,
    });
    setTab("learn");
  };

  const open = (item: TextItem) => {
    commit({ ...state, activeTextId: item.id });
    setTab("learn");
  };

  const update = (item: TextItem) => {
    commit({
      ...state,
      activeTextId: item.id,
      items: state.items.map((candidate) =>
        candidate.id === item.id ? item : candidate,
      ),
    });
  };

  const remove = (id: string) => {
    commit({
      ...state,
      items: state.items.filter((item) => item.id !== id),
      activeTextId: state.activeTextId === id ? undefined : state.activeTextId,
    });
  };

  const toggleTheme = () => {
    commit({
      ...state,
      theme: state.theme === "light" ? "dark" : "light",
    });
  };

  if (!hydrated) {
    return (
      <main className="splash">
        <div className="brand-mark">С</div>
        <strong>{APP_CONFIG.name}</strong>
      </main>
    );
  }

  const inTraining = tab === "learn" && Boolean(activeItem);

  return (
    <div className="app">
      {!inTraining && (
        <header className="app-header">
          <button className="brand" onClick={() => setTab("home")}>
            <span className="brand-mark">С</span>
            <span>{APP_CONFIG.name}</span>
          </button>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Переключить тему"
          >
            {state.theme === "light" ? "☾" : "☀"}
          </button>
        </header>
      )}

      {tab === "home" && (
        <HomeScreen items={state.items} onCreate={create} onOpen={open} />
      )}

      {tab === "library" && <LibraryScreen onCreate={create} />}

      {tab === "texts" && (
        <MyTextsScreen items={state.items} onOpen={open} onDelete={remove} />
      )}

      {tab === "review" && (
        <main className="screen page-stack">
          <section className="compact-hero">
            <span className="mini-label">Повторение</span>
            <h1>Закрепи то, что уже учил</h1>
            <p>
              Сначала показываем тексты с самым низким уровнем уверенности.
              Так время уходит именно на слабые места.
            </p>
          </section>
          {state.items.length ? (
            <div className="text-list">
              {[...state.items]
                .sort((a, b) => a.mastery - b.mastery)
                .map((item) => (
                  <button className="review-row" key={item.id} onClick={() => open(item)}>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.author}</span>
                    </div>
                    <b>{Math.round(item.mastery)}% →</b>
                  </button>
                ))}
            </div>
          ) : (
            <div className="empty-card">
              <div className="empty-icon">↻</div>
              <h2>Повторять пока нечего</h2>
              <p>Сначала добавь текст и пройди хотя бы одну тренировку.</p>
            </div>
          )}
        </main>
      )}

      {tab === "learn" && activeItem && (
        <TrainingScreen
          item={activeItem}
          onUpdate={update}
          onBack={() => setTab("texts")}
        />
      )}

      {tab === "learn" && !activeItem && (
        <main className="screen page-stack">
          <div className="empty-card">
            <div className="empty-icon">🧠</div>
            <h2>Выбери текст для обучения</h2>
            <p>Добавь свой текст на главной или открой произведение из библиотеки.</p>
            <button className="primary-btn" onClick={() => setTab("home")}>
              На главную
            </button>
          </div>
        </main>
      )}

      {!inTraining && <BottomNav active={tab} onChange={setTab} />}
    </div>
  );
}
