export function ProgressBar({ value }: { value: number }) {
  const safe = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="progress-track" aria-label={"Прогресс " + safe + "%"}>
      <div className="progress-fill" style={{ width: safe + "%" }} />
    </div>
  );
}
