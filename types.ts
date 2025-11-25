export enum ContentType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  PROJECT = 'PROJECT',
  NEWS = 'NEWS'
}

export interface User {
  id: string;
  name: string; // Display name (Zero-Knowledge ID usually hides this, but needed for UI)
  handle: string;
  avatar: string;
  karma: number;
  skills: string[];
}

export interface Post {
  id: string;
  author: User;
  content: string;
  type: ContentType;
  imageUrl?: string;
  timestamp: Date;
  truthScore?: number; // 0-100
  relatedTopics: string[];
  collaboratorsNeeded?: string[];
}

export interface Goal {
  id: string;
  label: string;
  prompt: string; // Instruction for the AI
}

export interface EmpathyAnalysis {
  isToxic: boolean;
  score: number; // 0-100 (100 is pure love, 0 is toxicity)
  constructiveRewrite?: string;
  consequencePrediction?: string;
}

export interface SynergyMatch {
  user: User;
  reason: string;
}