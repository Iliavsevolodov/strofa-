"use client";

export type AppTab = "home" | "library" | "learn" | "review" | "texts";

const items: Array<{ id: AppTab; icon: string; label: string }> = [
  { id: "home", icon: "⌂", label: "Главная" },
  { id: "library", icon: "▤", label: "Библиотека" },
  { id: "learn", icon: "◉", label: "Учить" },
  { id: "review", icon: "↻", label: "Повторить" },
  { id: "texts", icon: "▣", label: "Мои тексты" },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: AppTab;
  onChange: (tab: AppTab) => void;
}) {
  return (
    <nav className="bottom-nav" aria-label="Основная навигация">
      {items.map((item) => (
        <button
          key={item.id}
          className={active === item.id ? "nav-item active" : "nav-item"}
          onClick={() => onChange(item.id)}
          aria-current={active === item.id ? "page" : undefined}
        >
          <span className="nav-icon" aria-hidden>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
