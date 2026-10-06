import type { LearningBlock, LearningLine, TextItem } from "@/types/learning";

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const createLine = (text: string, order: number): LearningLine => ({
  id: uid(),
  order,
  text: text.trim(),
  words: text.trim().split(/\s+/).filter(Boolean),
  mastery: 0,
  correctAttempts: 0,
  incorrectAttempts: 0,
  hintCount: 0,
});

function normalizeBlocks(content: string): string[][] {
  const clean = content.replace(/\r\n/g, "\n").trim();
  if (!clean) return [];

  const rawStanzas = clean
    .split(/\n\s*\n/)
    .map((stanza) =>
      stanza.split("\n").map((line) => line.trim()).filter(Boolean),
    )
    .filter((stanza) => stanza.length > 0);

  if (rawStanzas.length > 1) return rawStanzas;

  const lines = rawStanzas[0] ?? [];
  const chunks: string[][] = [];
  for (let i = 0; i < lines.length; i += 4) {
    chunks.push(lines.slice(i, i + 4));
  }
  return chunks;
}

export function createTextItem(input: {
  title?: string;
  author?: string;
  content: string;
}): TextItem {
  const now = new Date().toISOString();
  const blocks: LearningBlock[] = normalizeBlocks(input.content).map(
    (lines, blockOrder) => ({
      id: uid(),
      order: blockOrder,
      lines: lines.map(createLine),
      mastery: 0,
      correctAttempts: 0,
      incorrectAttempts: 0,
      hintCount: 0,
    }),
  );

  return {
    id: uid(),
    title: input.title?.trim() || "Без названия",
    author: input.author?.trim() || "Автор не указан",
    content: input.content.trim(),
    blocks,
    createdAt: now,
    updatedAt: now,
    progress: 0,
    mastery: 0,
  };
}

export function getTextStats(item: TextItem) {
  const lines = item.blocks.flatMap((block) => block.lines);
  const wordCount = lines.reduce((sum, line) => sum + line.words.length, 0);
  const minutes = Math.max(5, Math.round(lines.length * 0.65 + wordCount * 0.035));
  const difficulty =
    wordCount < 80 ? "Легко" : wordCount < 180 ? "Средне" : "Сложно";

  return {
    lines: lines.length,
    words: wordCount,
    blocks: item.blocks.length,
    minutes,
    difficulty,
  };
}

export function firstLetters(line: string) {
  return line
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const cleaned = word.replace(/^[^\p{L}\p{N}]+/u, "");
      const punctuation = word.match(/[.,!?;:—…]+$/)?.[0] ?? "";
      return cleaned ? cleaned[0] + "." + punctuation : word;
    })
    .join(" ");
}

export function shuffle<T>(input: T[]): T[] {
  const copy = [...input];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function maskLine(line: LearningLine, ratio: number) {
  if (!line.words.length) return "";
  const count = Math.max(1, Math.floor(line.words.length * ratio));
  const ranked = line.words
    .map((word, index) => ({
      index,
      score: word.replace(/[^\p{L}\p{N}]/gu, "").length,
    }))
    .sort((a, b) => a.score - b.score);

  const hidden = new Set(ranked.slice(0, count).map((item) => item.index));
  return line.words
    .map((word, index) => (hidden.has(index) ? "_____" : word))
    .join(" ");
}
