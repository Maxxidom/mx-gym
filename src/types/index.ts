export type ExerciseCategory = 'cardio' | 'machine' | 'freeWeights';

export interface ExerciseTemplate {
  id: string;
  machineNumber: string;
  name: string;
  description: string;
  category: ExerciseCategory;
}

export interface SetData {
  setNumber: number;
  reps: number;
  weight: number | null;
}

export interface WorkoutExercise {
  id: string;
  templateId: string;
  sets: SetData[];
  notes: string;
  completedAt?: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  dayOfWeek: number[]; // 0-6, 0 = Sunday
  exerciseTemplateIds: string[];
}

export interface WorkoutSession {
  id: string;
  workoutDayId: string;
  date: string;
  exercises: WorkoutExercise[];
  completed: boolean;
}

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
}

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Вс', fullLabel: 'Воскресенье' },
  { value: 1, label: 'Пн', fullLabel: 'Понедельник' },
  { value: 2, label: 'Вт', fullLabel: 'Вторник' },
  { value: 3, label: 'Ср', fullLabel: 'Среда' },
  { value: 4, label: 'Чт', fullLabel: 'Четверг' },
  { value: 5, label: 'Пт', fullLabel: 'Пятница' },
  { value: 6, label: 'Сб', fullLabel: 'Суббота' },
];

export const CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  cardio: 'Кардио',
  machine: 'Тренажёр',
  freeWeights: 'Свободные веса',
};

export const CATEGORY_COLORS: Record<ExerciseCategory, string> = {
  cardio: 'bg-red-500',
  machine: 'bg-blue-500',
  freeWeights: 'bg-green-500',
};
