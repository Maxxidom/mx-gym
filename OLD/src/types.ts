export type ExerciseCategory = 'cardio' | 'machine' | 'free_weights';

export interface ExerciseTemplate {
  id: string;
  machineNumber: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  createdAt: string;
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export type ExerciseTimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface WorkoutExercise {
  id: string;
  templateId: string;
  sets: WorkoutSet[];
  completed: boolean;
  order: number;
  // Timer fields
  timerStatus: ExerciseTimerStatus;
  totalTime: number; // Accumulated time in seconds
  startedAt?: string; // When current segment started
  segments: { start: string; end: string }[]; // Time segments for history
}

export interface Workout {
  id: string;
  date: string;
  dayId?: string;
  exercises: WorkoutExercise[];
  completed: boolean;
  startedAt: string;
  completedAt?: string;
}

export interface TrainingDay {
  id: string;
  name: string;
  weekDays: number[];
  exerciseIds: string[];
}

export interface BodyWeightEntry {
  id: string;
  date: string;
  weight: number;
  createdAt: string;
}

export interface AppData {
  templates: ExerciseTemplate[];
  trainingDays: TrainingDay[];
  workouts: Workout[];
  bodyWeight: BodyWeightEntry[];
}
