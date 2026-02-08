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

// Running types
export type RunType = 'easy' | 'tempo' | 'intervals' | 'long' | 'recovery' | 'race';
export type RunSurface = 'asphalt' | 'trail' | 'track' | 'treadmill' | 'grass';
export type RunWeather = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' | 'hot' | 'cold';
export type RunFeeling = 'great' | 'good' | 'okay' | 'tired' | 'exhausted';
export type RunTimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface RunSession {
  id: string;
  date: string;
  // Time
  timerStatus: RunTimerStatus;
  totalTime: number; // seconds (excluding pauses)
  startedAt?: string;
  segments: { start: string; end: string }[];
  // Distance & pace
  distance: number; // km
  // Details
  runType: RunType;
  surface: RunSurface;
  weather?: RunWeather;
  effort: number; // 1-10
  feeling?: RunFeeling;
  notes?: string;
  // Calculated
  pace?: number; // seconds per km
  speed?: number; // km/h
  // Completion
  completed: boolean;
  completedAt?: string;
}

export interface AppData {
  templates: ExerciseTemplate[];
  trainingDays: TrainingDay[];
  workouts: Workout[];
  bodyWeight: BodyWeightEntry[];
  runSessions: RunSession[];
}
