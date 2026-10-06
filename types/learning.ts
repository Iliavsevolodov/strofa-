export type MasteryLevel = {
  mastery: number;
  correctAttempts: number;
  incorrectAttempts: number;
  hintCount: number;
  lastReviewedAt?: string;
};

export type LearningLine = MasteryLevel & {
  id: string;
  order: number;
  text: string;
  words: string[];
};

export type LearningBlock = MasteryLevel & {
  id: string;
  order: number;
  lines: LearningLine[];
};

export type TextItem = {
  id: string;
  title: string;
  author: string;
  content: string;
  blocks: LearningBlock[];
  createdAt: string;
  updatedAt: string;
  progress: number;
  mastery: number;
  nextReviewAt?: string;
};

export type ExerciseType =
  | "read"
  | "fade"
  | "missing"
  | "assemble"
  | "next-line"
  | "first-letters"
  | "recall";
