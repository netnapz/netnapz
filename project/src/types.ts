export interface Question {
  id: number;
  text: string;
}

export interface Character {
  id: number;
  name: string;
  attributes: Record<number, boolean>;
  image?: string;
  description: string;
  category: string;
}

export type Answer = 'yes' | 'no' | 'unsure';

export interface Hint {
  text: string;
  revealed: boolean;
}