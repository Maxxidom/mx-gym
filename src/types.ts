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
  // New fields
  intensity?: WorkoutIntensity;
  feeling?: WorkoutFeeling;
  calories?: number;
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

// User profile
export interface UserProfile {
  name: string;
  gender: 'male' | 'female' | '';
  birthDate: string;
  height: number; // cm
}

// Intensity & Feeling for workouts
export type WorkoutIntensity = 'light' | 'moderate' | 'high' | 'very_high';
export type WorkoutFeeling = 'great' | 'good' | 'okay' | 'tired' | 'exhausted';

// Running types - simplified to walking/running
export type RunType = 'walking' | 'running';
export type RunSurface = string; // Removed, kept for backwards compatibility
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
  steps?: number; // estimated steps
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
  calories?: number;
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
  userProfile: UserProfile;
}
