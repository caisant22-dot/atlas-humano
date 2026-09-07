import {EXPLANATIONS, type Atlas, type Concept, type SystemId} from './anatomy';

export type QuizMode = 'identify' | 'locate';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface QuizQuestion {
  concept: Concept;
  system: SystemId;
  options: string[];
}

export interface QuizState {
  active: boolean;
  mode: QuizMode;
  difficulty: Difficulty;
  systemFilter: SystemId | 'all';
  questions: QuizQuestion[];
  current: number;
  score: number;
  answered: number;
  streak: number;
  bestStreak: number;
  feedback: 'correct' | 'wrong' | null;
  userAnswer: string | null;
}

export const INITIAL_QUIZ: QuizState = {
  active: false,
  mode: 'identify',
  difficulty: 'beginner',
  systemFilter: 'all',
  questions: [],
  current: 0,
  score: 0,
  answered: 0,
  streak: 0,
  bestStreak: 0,
  feedback: null,
  userAnswer: null,
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateQuestions(
  atlas: Atlas,
  mode: QuizMode,
  difficulty: Difficulty,
  systemFilter: SystemId | 'all',
  count = 10,
): QuizQuestion[] {
  const systemParts = new Map<string, SystemId>();
  for (const p of atlas.parts) systemParts.set(p.id, p.system);

  let pool = atlas.concepts.filter(c => c.elements.length > 0);

  if (systemFilter !== 'all') {
    pool = pool.filter(c => c.elements.some(e => systemParts.get(e) === systemFilter));
  }

  if (difficulty === 'beginner') {
    pool = pool.filter(c => c.elements.length >= 3 || EXPLANATIONS[c.name.toLowerCase()]);
  } else if (difficulty === 'intermediate') {
    pool = pool.filter(c => c.elements.length >= 1 && c.elements.length <= 20);
  }

  pool = shuffle(pool).slice(0, count);

  return pool.map(concept => {
    const system = systemParts.get(concept.elements[0]) ?? 'skeletal';

    const distractors = shuffle(
      atlas.concepts
        .filter(c => c.id !== concept.id && c.elements.length > 0)
        .slice(0, 200),
    )
      .slice(0, 3)
      .map(c => c.name);

    const options = shuffle([concept.name, ...distractors]);

    return {concept, system, options};
  });
}

export type QuizAction =
  | {type: 'start'; mode: QuizMode; difficulty: Difficulty; systemFilter: SystemId | 'all'; questions: QuizQuestion[]}
  | {type: 'answer'; answer: string; conceptId: string}
  | {type: 'next'}
  | {type: 'quit'};

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'start':
      return {
        ...INITIAL_QUIZ,
        active: true,
        mode: action.mode,
        difficulty: action.difficulty,
        systemFilter: action.systemFilter,
        questions: action.questions,
      };

    case 'answer': {
      const q = state.questions[state.current];
      const correct =
        action.answer.toLowerCase() === q.concept.name.toLowerCase() ||
        action.conceptId === q.concept.id;
      const newStreak = correct ? state.streak + 1 : 0;
      return {
        ...state,
        feedback: correct ? 'correct' : 'wrong',
        userAnswer: action.answer,
        score: state.score + (correct ? 1 : 0),
        answered: state.answered + 1,
        streak: newStreak,
        bestStreak: Math.max(state.bestStreak, newStreak),
      };
    }

    case 'next': {
      const next = state.current + 1;
      if (next >= state.questions.length) {
        return {...state, active: false, feedback: null};
      }
      return {...state, current: next, feedback: null, userAnswer: null};
    }

    case 'quit':
      return INITIAL_QUIZ;
  }
}
