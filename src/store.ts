import { AppData, ExerciseTemplate, TrainingDay, Workout, WorkoutExercise, WorkoutSet, RunSession, UserProfile, WorkoutIntensity } from './types';

const STORAGE_KEY = 'gym_app_data';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Default user profile
const defaultUserProfile: UserProfile = {
  name: '',
  gender: '',
  birthDate: '',
  height: 0,
};

// MET values for running based on type
const RUN_MET: Record<string, number> = {
  walking: 4.0,
  running: 10.0,
};

// MET values for strength training based on intensity
// Эти значения уменьшены, т.к. при силовой тренировке ~30% времени это активная работа
const WORKOUT_MET: Record<WorkoutIntensity, number> = {
  light: 2.5,    // ~4-5 ккал/мин с учётом отдыха
  moderate: 3.5, // ~5-6 ккал/мин с учётом отдыха  
  high: 4.5,     // ~6-8 ккал/мин с учётом отдыха
  very_high: 6.0, // ~8-10 ккал/мин с учётом отдыха
};

// Calculate calories: MET × weight(kg) × time(hours)
// Для более точного расчёта при силовых тренировках применяется коэффициент активности
export const calculateCalories = (
  met: number,
  weightKg: number,
  timeSeconds: number,
  activityFactor: number = 1.0 // 0.4 для силовых (40% активное время), 1.0 для кардио
): number => {
  const hours = timeSeconds / 3600;
  return Math.round(met * weightKg * hours * activityFactor);
};

// Get user age from birthdate
export const getUserAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// Calculate BMR using Mifflin-St Jeor formula
export const calculateBMR = (profile: UserProfile, weightKg: number): number => {
  if (!profile.gender || !profile.height || !weightKg || !profile.birthDate) return 0;
  const age = getUserAge(profile.birthDate);
  if (age <= 0) return 0;
  
  if (profile.gender === 'male') {
    return Math.round(10 * weightKg + 6.25 * profile.height - 5 * age + 5);
  } else {
    return Math.round(10 * weightKg + 6.25 * profile.height - 5 * age - 161);
  }
};

// Calculate run calories (кардио - 100% активное время)
export const calculateRunCalories = (
  runType: string,
  weightKg: number,
  timeSeconds: number
): number => {
  const met = RUN_MET[runType] || 8.0;
  return calculateCalories(met, weightKg, timeSeconds, 1.0);
};

// Calculate workout calories (силовые - ~40% активное время из-за отдыха между подходами)
export const calculateWorkoutCalories = (
  intensity: WorkoutIntensity,
  weightKg: number,
  timeSeconds: number
): number => {
  const met = WORKOUT_MET[intensity];
  // Коэффициент 0.5 учитывает что ~50% времени тренировки это отдых между подходами
  return calculateCalories(met, weightKg, timeSeconds, 0.5);
};

// Helper to create a new exercise with timer fields
const createWorkoutExercise = (
  templateId: string, 
  order: number, 
  sets: Omit<WorkoutSet, 'id'>[]
): WorkoutExercise => ({
  id: generateId(),
  templateId,
  sets: sets.map(s => ({ ...s, id: generateId() })),
  completed: false,
  order,
  timerStatus: 'idle',
  totalTime: 0,
  segments: [],
});

// Демо данные
const createDemoData = (): AppData => {
  const templates: ExerciseTemplate[] = [
    // Кардио
    { id: 't1', machineNumber: 'C01', name: 'Беговая дорожка', description: 'Кардио разминка', category: 'cardio', createdAt: new Date().toISOString() },
    { id: 't2', machineNumber: 'C02', name: 'Велотренажёр', description: 'Кардио', category: 'cardio', createdAt: new Date().toISOString() },
    // Тренажёры
    { id: 't3', machineNumber: 'M01', name: 'Жим ногами', description: 'Ноги, квадрицепсы', category: 'machine', createdAt: new Date().toISOString() },
    { id: 't4', machineNumber: 'M02', name: 'Сгибание ног', description: 'Бицепс бедра', category: 'machine', createdAt: new Date().toISOString() },
    { id: 't5', machineNumber: 'M03', name: 'Тяга верхнего блока', description: 'Широчайшие, спина', category: 'machine', createdAt: new Date().toISOString() },
    { id: 't6', machineNumber: 'M04', name: 'Жим от груди', description: 'Грудные мышцы', category: 'machine', createdAt: new Date().toISOString() },
    { id: 't7', machineNumber: 'M05', name: 'Бабочка', description: 'Грудные, изоляция', category: 'machine', createdAt: new Date().toISOString() },
    // Свободные веса
    { id: 't8', machineNumber: 'F01', name: 'Жим лёжа', description: 'Штанга, грудь', category: 'free_weights', createdAt: new Date().toISOString() },
    { id: 't9', machineNumber: 'F02', name: 'Приседания', description: 'Штанга, ноги', category: 'free_weights', createdAt: new Date().toISOString() },
    { id: 't10', machineNumber: 'F03', name: 'Подъём на бицепс', description: 'Гантели', category: 'free_weights', createdAt: new Date().toISOString() },
    { id: 't11', machineNumber: 'F04', name: 'Французский жим', description: 'Гантели, трицепс', category: 'free_weights', createdAt: new Date().toISOString() },
    { id: 't12', machineNumber: 'F05', name: 'Тяга гантели', description: 'Спина, широчайшие', category: 'free_weights', createdAt: new Date().toISOString() },
  ];

  const trainingDays: TrainingDay[] = [
    { id: 'd1', name: 'Грудь + Трицепс', weekDays: [1, 4], exerciseIds: ['t1', 't6', 't7', 't8', 't11'] },
    { id: 'd2', name: 'Спина + Бицепс', weekDays: [2, 5], exerciseIds: ['t1', 't5', 't12', 't10'] },
    { id: 'd3', name: 'Ноги', weekDays: [3, 6], exerciseIds: ['t2', 't3', 't4', 't9'] },
  ];

  // Создаём историю тренировок за последние 2 недели
  const workouts: Workout[] = [];
  const now = new Date();
  
  // Тренировка 1 неделю назад - Грудь
  const date1 = new Date(now);
  date1.setDate(date1.getDate() - 7);
  workouts.push({
    id: 'w1',
    date: date1.toISOString().split('T')[0],
    dayId: 'd1',
    exercises: [
      {
        id: 'we1', templateId: 't6',
        sets: [
          { id: 's1', reps: 12, weight: 40, completed: true },
          { id: 's2', reps: 10, weight: 45, completed: true },
          { id: 's3', reps: 8, weight: 50, completed: true },
        ],
        completed: true, order: 0,
        timerStatus: 'completed', totalTime: 420, segments: []
      },
      {
        id: 'we2', templateId: 't8',
        sets: [
          { id: 's4', reps: 10, weight: 50, completed: true },
          { id: 's5', reps: 8, weight: 55, completed: true },
          { id: 's6', reps: 6, weight: 60, completed: true },
        ],
        completed: true, order: 1,
        timerStatus: 'completed', totalTime: 380, segments: []
      },
    ],
    completed: true,
    startedAt: date1.toISOString(),
    completedAt: date1.toISOString(),
  });

  // Тренировка 5 дней назад - Спина
  const date2 = new Date(now);
  date2.setDate(date2.getDate() - 5);
  workouts.push({
    id: 'w2',
    date: date2.toISOString().split('T')[0],
    dayId: 'd2',
    exercises: [
      {
        id: 'we3', templateId: 't5',
        sets: [
          { id: 's7', reps: 12, weight: 35, completed: true },
          { id: 's8', reps: 10, weight: 40, completed: true },
          { id: 's9', reps: 10, weight: 40, completed: true },
        ],
        completed: true, order: 0,
        timerStatus: 'completed', totalTime: 350, segments: []
      },
      {
        id: 'we4', templateId: 't10',
        sets: [
          { id: 's10', reps: 12, weight: 12, completed: true },
          { id: 's11', reps: 10, weight: 14, completed: true },
          { id: 's12', reps: 8, weight: 14, completed: true },
        ],
        completed: true, order: 1,
        timerStatus: 'completed', totalTime: 290, segments: []
      },
    ],
    completed: true,
    startedAt: date2.toISOString(),
    completedAt: date2.toISOString(),
  });

  // Тренировка 3 дня назад - Ноги
  const date3 = new Date(now);
  date3.setDate(date3.getDate() - 3);
  workouts.push({
    id: 'w3',
    date: date3.toISOString().split('T')[0],
    dayId: 'd3',
    exercises: [
      {
        id: 'we5', templateId: 't3',
        sets: [
          { id: 's13', reps: 15, weight: 80, completed: true },
          { id: 's14', reps: 12, weight: 100, completed: true },
          { id: 's15', reps: 10, weight: 120, completed: true },
          { id: 's16', reps: 8, weight: 140, completed: true },
        ],
        completed: true, order: 0,
        timerStatus: 'completed', totalTime: 520, segments: []
      },
      {
        id: 'we6', templateId: 't9',
        sets: [
          { id: 's17', reps: 10, weight: 60, completed: true },
          { id: 's18', reps: 8, weight: 70, completed: true },
          { id: 's19', reps: 6, weight: 80, completed: true },
        ],
        completed: true, order: 1,
        timerStatus: 'completed', totalTime: 450, segments: []
      },
    ],
    completed: true,
    startedAt: date3.toISOString(),
    completedAt: date3.toISOString(),
  });

  // Демо данные веса тела
  const bodyWeight = [
    { id: 'bw1', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], weight: 85.5, createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'bw2', date: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], weight: 85.0, createdAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'bw3', date: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], weight: 84.5, createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'bw4', date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], weight: 84.0, createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'bw5', date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], weight: 84.2, createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'bw6', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], weight: 83.8, createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'bw7', date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], weight: 83.5, createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'bw8', date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], weight: 83.0, createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'bw9', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], weight: 82.8, createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'bw10', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], weight: 82.5, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'bw11', date: new Date().toISOString().split('T')[0], weight: 82.2, createdAt: new Date().toISOString() },
  ];

  // Демо данные пробежек
  const runSessions: RunSession[] = [
    {
      id: 'r1',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      timerStatus: 'completed',
      totalTime: 1800, // 30 минут
      segments: [],
      distance: 5.2,
      runType: 'running',
      surface: '',
      weather: 'sunny',
      effort: 5,
      feeling: 'good',
      notes: 'Утренняя пробежка в парке',
      pace: 346, // 5:46/км
      speed: 10.4,
      completed: true,
      completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'r2',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      timerStatus: 'completed',
      totalTime: 2700, // 45 минут
      segments: [],
      distance: 7.5,
      runType: 'running',
      surface: '',
      weather: 'cloudy',
      effort: 7,
      feeling: 'okay',
      notes: 'Темповая тренировка',
      pace: 360,
      speed: 10.0,
      completed: true,
      completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'r3',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      timerStatus: 'completed',
      totalTime: 3600, // 60 минут
      segments: [],
      distance: 10.0,
      runType: 'running',
      surface: '',
      weather: 'sunny',
      effort: 6,
      feeling: 'great',
      notes: 'Длинная пробежка по лесу',
      pace: 360,
      speed: 10.0,
      completed: true,
      completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'r4',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      timerStatus: 'completed',
      totalTime: 2400, // 40 минут
      segments: [],
      distance: 3.2,
      runType: 'walking',
      surface: '',
      weather: undefined,
      effort: 3,
      feeling: 'good',
      notes: 'Вечерняя прогулка',
      pace: 750,
      speed: 4.8,
      completed: true,
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return { templates, trainingDays, workouts, bodyWeight, runSessions, userProfile: defaultUserProfile };
};

// Migrate old exercise data to include timer fields
const migrateExercise = (e: any): WorkoutExercise => ({
  ...e,
  timerStatus: e.timerStatus || (e.completed ? 'completed' : 'idle'),
  totalTime: e.totalTime || 0,
  segments: e.segments || [],
});

export const loadData = (): AppData => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      // Миграция данных
      if (!data.bodyWeight) {
        data.bodyWeight = [];
      }
      if (!data.runSessions) {
        data.runSessions = [];
      }
      if (!data.userProfile) {
        data.userProfile = defaultUserProfile;
      }
      // Migrate workouts to include timer fields
      data.workouts = data.workouts.map((w: any) => ({
        ...w,
        exercises: w.exercises.map(migrateExercise),
      }));
      return data;
    }
  } catch (e) {
    console.error('Error loading data:', e);
  }
  return createDemoData();
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data:', e);
  }
};

// Утилиты для работы с данными
export const createTemplate = (data: AppData, template: Omit<ExerciseTemplate, 'id' | 'createdAt'>): AppData => {
  const newTemplate: ExerciseTemplate = {
    ...template,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  return { ...data, templates: [...data.templates, newTemplate] };
};

export const updateTemplate = (data: AppData, id: string, updates: Partial<ExerciseTemplate>): AppData => {
  return {
    ...data,
    templates: data.templates.map(t => t.id === id ? { ...t, ...updates } : t),
  };
};

export const deleteTemplate = (data: AppData, id: string): AppData => {
  return {
    ...data,
    templates: data.templates.filter(t => t.id !== id),
    trainingDays: data.trainingDays.map(d => ({
      ...d,
      exerciseIds: d.exerciseIds.filter(eid => eid !== id),
    })),
  };
};

export const createTrainingDay = (data: AppData, day: Omit<TrainingDay, 'id'>): AppData => {
  const newDay: TrainingDay = { ...day, id: generateId() };
  return { ...data, trainingDays: [...data.trainingDays, newDay] };
};

export const updateTrainingDay = (data: AppData, id: string, updates: Partial<TrainingDay>): AppData => {
  return {
    ...data,
    trainingDays: data.trainingDays.map(d => d.id === id ? { ...d, ...updates } : d),
  };
};

export const deleteTrainingDay = (data: AppData, id: string): AppData => {
  return {
    ...data,
    trainingDays: data.trainingDays.filter(d => d.id !== id),
  };
};

export const getLastWorkoutForExercise = (data: AppData, templateId: string): WorkoutExercise | null => {
  const completedWorkouts = data.workouts
    .filter(w => w.completed)
    .sort((a, b) => new Date(b.completedAt || b.startedAt).getTime() - new Date(a.completedAt || a.startedAt).getTime());
  
  for (const workout of completedWorkouts) {
    const exercise = workout.exercises.find(e => e.templateId === templateId);
    if (exercise) {
      return exercise;
    }
  }
  return null;
};

export const startWorkout = (data: AppData, dayId?: string, exerciseIds?: string[]): AppData => {
  const ids = exerciseIds || (dayId ? data.trainingDays.find(d => d.id === dayId)?.exerciseIds : []) || [];
  
  const exercises: WorkoutExercise[] = ids.map((templateId, index) => {
    const lastWorkout = getLastWorkoutForExercise(data, templateId);
    
    // Если есть прошлая тренировка, берём данные оттуда
    if (lastWorkout) {
      return createWorkoutExercise(
        templateId, 
        index,
        lastWorkout.sets.map(s => ({ reps: s.reps, weight: s.weight, completed: false }))
      );
    }
    
    // Иначе создаём 3 пустых подхода
    return createWorkoutExercise(templateId, index, [
      { reps: 10, weight: 0, completed: false },
      { reps: 10, weight: 0, completed: false },
      { reps: 10, weight: 0, completed: false },
    ]);
  });

  const newWorkout: Workout = {
    id: generateId(),
    date: new Date().toISOString().split('T')[0],
    dayId,
    exercises,
    completed: false,
    startedAt: new Date().toISOString(),
  };

  return { ...data, workouts: [...data.workouts, newWorkout] };
};

export const updateWorkout = (data: AppData, workoutId: string, updates: Partial<Workout>): AppData => {
  return {
    ...data,
    workouts: data.workouts.map(w => w.id === workoutId ? { ...w, ...updates } : w),
  };
};

export const updateWorkoutExercise = (
  data: AppData, 
  workoutId: string, 
  exerciseId: string, 
  updates: Partial<WorkoutExercise>
): AppData => {
  return {
    ...data,
    workouts: data.workouts.map(w => {
      if (w.id !== workoutId) return w;
      return {
        ...w,
        exercises: w.exercises.map(e => e.id === exerciseId ? { ...e, ...updates } : e),
      };
    }),
  };
};

export const addSetToExercise = (data: AppData, workoutId: string, exerciseId: string): AppData => {
  return {
    ...data,
    workouts: data.workouts.map(w => {
      if (w.id !== workoutId) return w;
      return {
        ...w,
        exercises: w.exercises.map(e => {
          if (e.id !== exerciseId) return e;
          const lastSet = e.sets[e.sets.length - 1];
          return {
            ...e,
            sets: [...e.sets, {
              id: generateId(),
              reps: lastSet?.reps || 10,
              weight: lastSet?.weight || 0,
              completed: false,
            }],
          };
        }),
      };
    }),
  };
};

export const updateSet = (
  data: AppData, 
  workoutId: string, 
  exerciseId: string, 
  setId: string,
  updates: Partial<WorkoutSet>
): AppData => {
  return {
    ...data,
    workouts: data.workouts.map(w => {
      if (w.id !== workoutId) return w;
      return {
        ...w,
        exercises: w.exercises.map(e => {
          if (e.id !== exerciseId) return e;
          return {
            ...e,
            sets: e.sets.map(s => s.id === setId ? { ...s, ...updates } : s),
          };
        }),
      };
    }),
  };
};

export const deleteSet = (data: AppData, workoutId: string, exerciseId: string, setId: string): AppData => {
  return {
    ...data,
    workouts: data.workouts.map(w => {
      if (w.id !== workoutId) return w;
      return {
        ...w,
        exercises: w.exercises.map(e => {
          if (e.id !== exerciseId) return e;
          return {
            ...e,
            sets: e.sets.filter(s => s.id !== setId),
          };
        }),
      };
    }),
  };
};

export const completeWorkout = (data: AppData, workoutId: string): AppData => {
  return {
    ...data,
    workouts: data.workouts.map(w => {
      if (w.id !== workoutId) return w;
      return {
        ...w,
        completed: true,
        completedAt: new Date().toISOString(),
      };
    }),
  };
};

export const deleteWorkout = (data: AppData, workoutId: string): AppData => {
  return {
    ...data,
    workouts: data.workouts.filter(w => w.id !== workoutId),
  };
};

export const addExerciseToWorkout = (data: AppData, workoutId: string, templateId: string): AppData => {
  const lastWorkout = getLastWorkoutForExercise(data, templateId);
  
  return {
    ...data,
    workouts: data.workouts.map(w => {
      if (w.id !== workoutId) return w;
      
      const newExercise = createWorkoutExercise(
        templateId,
        w.exercises.length,
        lastWorkout 
          ? lastWorkout.sets.map(s => ({ reps: s.reps, weight: s.weight, completed: false }))
          : [
              { reps: 10, weight: 0, completed: false },
              { reps: 10, weight: 0, completed: false },
              { reps: 10, weight: 0, completed: false },
            ]
      );
      
      return {
        ...w,
        exercises: [...w.exercises, newExercise],
      };
    }),
  };
};

// Timer functions
export const startExerciseTimer = (data: AppData, workoutId: string, exerciseId: string): AppData => {
  const now = new Date().toISOString();
  return updateWorkoutExercise(data, workoutId, exerciseId, {
    timerStatus: 'running',
    startedAt: now,
  });
};

export const pauseExerciseTimer = (data: AppData, workoutId: string, exerciseId: string): AppData => {
  const workout = data.workouts.find(w => w.id === workoutId);
  const exercise = workout?.exercises.find(e => e.id === exerciseId);
  
  if (!exercise || !exercise.startedAt) return data;
  
  const now = new Date();
  const startTime = new Date(exercise.startedAt);
  const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
  
  return updateWorkoutExercise(data, workoutId, exerciseId, {
    timerStatus: 'paused',
    totalTime: exercise.totalTime + elapsedSeconds,
    startedAt: undefined,
    segments: [...exercise.segments, { start: exercise.startedAt, end: now.toISOString() }],
  });
};

export const completeExerciseTimer = (data: AppData, workoutId: string, exerciseId: string): AppData => {
  const workout = data.workouts.find(w => w.id === workoutId);
  const exercise = workout?.exercises.find(e => e.id === exerciseId);
  
  if (!exercise) return data;
  
  let finalTime = exercise.totalTime;
  const segments = [...exercise.segments];
  
  // If timer is running, add current segment
  if (exercise.timerStatus === 'running' && exercise.startedAt) {
    const now = new Date();
    const startTime = new Date(exercise.startedAt);
    finalTime += Math.floor((now.getTime() - startTime.getTime()) / 1000);
    segments.push({ start: exercise.startedAt, end: now.toISOString() });
  }
  
  return updateWorkoutExercise(data, workoutId, exerciseId, {
    timerStatus: 'completed',
    totalTime: finalTime,
    startedAt: undefined,
    segments,
    completed: true,
  });
};

export const getExerciseHistory = (data: AppData, templateId: string): Workout[] => {
  return data.workouts
    .filter(w => w.completed && w.exercises.some(e => e.templateId === templateId))
    .sort((a, b) => new Date(b.completedAt || b.startedAt).getTime() - new Date(a.completedAt || a.startedAt).getTime());
};

export const roundWeight = (weight: number): number => {
  return Math.round(weight * 2) / 2; // Округляем до 0.5
};

export const getTodayDayOfWeek = (): number => {
  const day = new Date().getDay();
  return day === 0 ? 7 : day; // 1-7, где 1 = понедельник
};

export const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const CATEGORY_INFO = {
  cardio: { label: 'Кардио', color: '#10b981', bg: '#d1fae5' },
  machine: { label: 'Тренажёр', color: '#3b82f6', bg: '#dbeafe' },
  free_weights: { label: 'Свободные веса', color: '#f59e0b', bg: '#fef3c7' },
};

// Функции для работы с весом тела
export const addBodyWeight = (data: AppData, weight: number): AppData => {
  const today = new Date().toISOString().split('T')[0];
  const existingIndex = data.bodyWeight.findIndex(bw => bw.date === today);
  
  // Сохраняем вес как есть, без округления
  const finalWeight = Math.round(weight * 10) / 10; // Округляем только до 0.1
  
  if (existingIndex >= 0) {
    // Обновляем существующую запись за сегодня
    return {
      ...data,
      bodyWeight: data.bodyWeight.map((bw, i) => 
        i === existingIndex ? { ...bw, weight: finalWeight } : bw
      ),
    };
  }
  
  // Создаём новую запись
  return {
    ...data,
    bodyWeight: [...data.bodyWeight, {
      id: generateId(),
      date: today,
      weight: finalWeight,
      createdAt: new Date().toISOString(),
    }],
  };
};

export const deleteBodyWeight = (data: AppData, id: string): AppData => {
  return {
    ...data,
    bodyWeight: data.bodyWeight.filter(bw => bw.id !== id),
  };
};

export const getBodyWeightStats = (data: AppData) => {
  const sorted = [...data.bodyWeight].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  if (sorted.length === 0) {
    return { 
      current: 0, 
      start: 0, 
      change: 0, 
      min: 0, 
      max: 0, 
      trend: 'stable' as const,
      week: 0,
      month: 0,
    };
  }
  
  const current = sorted[sorted.length - 1].weight;
  const start = sorted[0].weight;
  const change = current - start;
  const min = Math.min(...sorted.map(bw => bw.weight));
  const max = Math.max(...sorted.map(bw => bw.weight));
  
  // Calculate 7-day change
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekData = sorted.filter(bw => new Date(bw.date) >= weekAgo);
  const week = weekData.length >= 2 
    ? weekData[weekData.length - 1].weight - weekData[0].weight 
    : 0;
  
  // Calculate 30-day change
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const monthData = sorted.filter(bw => new Date(bw.date) >= monthAgo);
  const month = monthData.length >= 2 
    ? monthData[monthData.length - 1].weight - monthData[0].weight 
    : 0;
  
  // Определяем тренд на основе последних 5 записей
  // Порог 100 грамм (0.1 кг) - любое изменение больше 100г считается трендом
  const last5 = sorted.slice(-5);
  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (last5.length >= 2) {
    const firstWeight = last5[0].weight;
    const lastWeight = last5[last5.length - 1].weight;
    if (lastWeight - firstWeight > 0.1) trend = 'up';
    else if (firstWeight - lastWeight > 0.1) trend = 'down';
  }
  
  return { current, start, change, min, max, trend, week, month };
};

// Format seconds to mm:ss
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Format seconds to h:mm:ss
export const formatTimeHMS = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Format pace (seconds per km) to mm:ss
export const formatPace = (paceSeconds: number): string => {
  if (!paceSeconds || paceSeconds === Infinity) return '--:--';
  const mins = Math.floor(paceSeconds / 60);
  const secs = Math.round(paceSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Calculate pace and speed from time and distance
export const calculateRunStats = (totalSeconds: number, distanceKm: number) => {
  if (distanceKm <= 0) {
    return { pace: 0, speed: 0 };
  }
  const pace = totalSeconds / distanceKm; // seconds per km
  const speed = (distanceKm / totalSeconds) * 3600; // km/h
  return { pace, speed: Math.round(speed * 10) / 10 };
};

// Run session functions
export const startRunSession = (data: AppData): AppData => {
  const now = new Date().toISOString();
  const newRun: RunSession = {
    id: generateId(),
    date: new Date().toISOString().split('T')[0],
    timerStatus: 'running',
    totalTime: 0,
    startedAt: now,
    segments: [],
    distance: 0,
    runType: 'running',
    surface: '',
    effort: 5,
    completed: false,
  };
  return { ...data, runSessions: [...data.runSessions, newRun] };
};

export const pauseRunSession = (data: AppData, runId: string): AppData => {
  const run = data.runSessions.find(r => r.id === runId);
  if (!run || !run.startedAt) return data;
  
  const now = new Date();
  const startTime = new Date(run.startedAt);
  const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
  
  return {
    ...data,
    runSessions: data.runSessions.map(r => {
      if (r.id !== runId) return r;
      return {
        ...r,
        timerStatus: 'paused',
        totalTime: r.totalTime + elapsedSeconds,
        startedAt: undefined,
        segments: [...r.segments, { start: run.startedAt!, end: now.toISOString() }],
      };
    }),
  };
};

export const resumeRunSession = (data: AppData, runId: string): AppData => {
  const now = new Date().toISOString();
  return {
    ...data,
    runSessions: data.runSessions.map(r => {
      if (r.id !== runId) return r;
      return {
        ...r,
        timerStatus: 'running',
        startedAt: now,
      };
    }),
  };
};

export const updateRunSession = (data: AppData, runId: string, updates: Partial<RunSession>): AppData => {
  return {
    ...data,
    runSessions: data.runSessions.map(r => r.id === runId ? { ...r, ...updates } : r),
  };
};

export const completeRunSession = (data: AppData, runId: string, distance: number): AppData => {
  const run = data.runSessions.find(r => r.id === runId);
  if (!run) return data;
  
  let finalTime = run.totalTime;
  const segments = [...run.segments];
  
  // If timer is running, add current segment
  if (run.timerStatus === 'running' && run.startedAt) {
    const now = new Date();
    const startTime = new Date(run.startedAt);
    finalTime += Math.floor((now.getTime() - startTime.getTime()) / 1000);
    segments.push({ start: run.startedAt, end: now.toISOString() });
  }
  
  const { pace, speed } = calculateRunStats(finalTime, distance);
  
  return {
    ...data,
    runSessions: data.runSessions.map(r => {
      if (r.id !== runId) return r;
      return {
        ...r,
        timerStatus: 'completed',
        totalTime: finalTime,
        startedAt: undefined,
        segments,
        distance,
        pace,
        speed,
        completed: true,
        completedAt: new Date().toISOString(),
      };
    }),
  };
};

export const deleteRunSession = (data: AppData, runId: string): AppData => {
  return {
    ...data,
    runSessions: data.runSessions.filter(r => r.id !== runId),
  };
};

export const getRunStats = (data: AppData) => {
  const completed = data.runSessions.filter(r => r.completed);
  if (completed.length === 0) {
    return {
      totalRuns: 0,
      totalDistance: 0,
      totalTime: 0,
      avgPace: 0,
      avgDistance: 0,
      bestPace: 0,
      longestRun: 0,
      weekDistance: 0,
      monthDistance: 0,
    };
  }
  
  const totalDistance = completed.reduce((sum, r) => sum + r.distance, 0);
  const totalTime = completed.reduce((sum, r) => sum + r.totalTime, 0);
  const avgPace = totalTime / totalDistance;
  const avgDistance = totalDistance / completed.length;
  const bestPace = Math.min(...completed.filter(r => r.pace && r.pace > 0).map(r => r.pace!));
  const longestRun = Math.max(...completed.map(r => r.distance));
  
  // Week distance
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekRuns = completed.filter(r => new Date(r.date) >= weekAgo);
  const weekDistance = weekRuns.reduce((sum, r) => sum + r.distance, 0);
  
  // Month distance
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const monthRuns = completed.filter(r => new Date(r.date) >= monthAgo);
  const monthDistance = monthRuns.reduce((sum, r) => sum + r.distance, 0);
  
  return {
    totalRuns: completed.length,
    totalDistance: Math.round(totalDistance * 10) / 10,
    totalTime,
    avgPace: Math.round(avgPace),
    avgDistance: Math.round(avgDistance * 10) / 10,
    bestPace: bestPace === Infinity ? 0 : Math.round(bestPace),
    longestRun: Math.round(longestRun * 10) / 10,
    weekDistance: Math.round(weekDistance * 10) / 10,
    monthDistance: Math.round(monthDistance * 10) / 10,
  };
};

export const RUN_TYPES: Record<string, { label: string; emoji: string }> = {
  walking: { label: 'Ходьба', emoji: '🚶' },
  running: { label: 'Бег', emoji: '🏃' },
};

export const RUN_SURFACES: Record<string, { label: string; emoji: string }> = {};

export const RUN_WEATHER: Record<string, { label: string; emoji: string }> = {
  sunny: { label: 'Солнечно', emoji: '☀️' },
  cloudy: { label: 'Облачно', emoji: '☁️' },
  rainy: { label: 'Дождь', emoji: '🌧️' },
  snowy: { label: 'Снег', emoji: '❄️' },
  windy: { label: 'Ветер', emoji: '💨' },
  hot: { label: 'Жарко', emoji: '🥵' },
  cold: { label: 'Холодно', emoji: '🥶' },
};

export const RUN_FEELINGS: Record<string, { label: string; emoji: string; color: string }> = {
  great: { label: 'Отлично', emoji: '🤩', color: '#22c55e' },
  good: { label: 'Хорошо', emoji: '😊', color: '#84cc16' },
  okay: { label: 'Нормально', emoji: '😐', color: '#eab308' },
  tired: { label: 'Устал', emoji: '😓', color: '#f97316' },
  exhausted: { label: 'Измотан', emoji: '😵', color: '#ef4444' },
};

export const WORKOUT_FEELINGS = RUN_FEELINGS;

// Get today's calories stats
export const getTodayCaloriesStats = (data: AppData) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Workout calories today
  const todayWorkouts = data.workouts.filter(w => 
    w.completed && w.date === today && w.calories
  );
  const workoutCalories = todayWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0);
  
  // Run calories today
  const todayRuns = data.runSessions.filter(r => 
    r.completed && r.date === today && r.calories
  );
  const runCalories = todayRuns.reduce((sum, r) => sum + (r.calories || 0), 0);
  
  // Weekly stats
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];
  
  const weekWorkouts = data.workouts.filter(w => 
    w.completed && w.date >= weekAgoStr && w.calories
  );
  const weekWorkoutCalories = weekWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0);
  
  const weekRuns = data.runSessions.filter(r => 
    r.completed && r.date >= weekAgoStr && r.calories
  );
  const weekRunCalories = weekRuns.reduce((sum, r) => sum + (r.calories || 0), 0);
  
  return {
    today: {
      workout: workoutCalories,
      run: runCalories,
      total: workoutCalories + runCalories,
    },
    week: {
      workout: weekWorkoutCalories,
      run: weekRunCalories,
      total: weekWorkoutCalories + weekRunCalories,
    },
  };
};

export const WORKOUT_INTENSITIES: Record<WorkoutIntensity, { label: string; emoji: string; color: string }> = {
  light: { label: 'Лёгкая', emoji: '🌱', color: '#22c55e' },
  moderate: { label: 'Средняя', emoji: '💪', color: '#3b82f6' },
  high: { label: 'Высокая', emoji: '🔥', color: '#f97316' },
  very_high: { label: 'Максимум', emoji: '⚡', color: '#ef4444' },
};

// User profile functions
export const updateUserProfile = (data: AppData, updates: Partial<UserProfile>): AppData => {
  return {
    ...data,
    userProfile: { ...data.userProfile, ...updates },
  };
};

// Get current weight from bodyWeight entries
export const getCurrentWeight = (data: AppData): number => {
  if (data.bodyWeight.length === 0) return 0;
  const sorted = [...data.bodyWeight].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return sorted[0].weight;
};

// Complete workout with intensity, feeling, and calories
export const completeWorkoutWithDetails = (
  data: AppData,
  workoutId: string,
  intensity: WorkoutIntensity,
  feeling: string
): AppData => {
  const workout = data.workouts.find(w => w.id === workoutId);
  if (!workout) return data;
  
  // Calculate total workout time
  const totalTime = workout.exercises.reduce((sum, e) => sum + (e.totalTime || 0), 0);
  
  // Get current weight
  const weight = getCurrentWeight(data);
  
  // Calculate calories
  const calories = weight > 0 ? calculateWorkoutCalories(intensity, weight, totalTime) : 0;
  
  return {
    ...data,
    workouts: data.workouts.map(w => {
      if (w.id !== workoutId) return w;
      return {
        ...w,
        completed: true,
        completedAt: new Date().toISOString(),
        intensity,
        feeling: feeling as any,
        calories,
      };
    }),
  };
};

// Complete run with calories calculation
export const completeRunWithCalories = (
  data: AppData,
  runId: string,
  distance: number,
  feeling?: string
): AppData => {
  const run = data.runSessions.find(r => r.id === runId);
  if (!run) return data;
  
  let finalTime = run.totalTime;
  const segments = [...run.segments];
  
  // If timer is running, add current segment
  if (run.timerStatus === 'running' && run.startedAt) {
    const now = new Date();
    const startTime = new Date(run.startedAt);
    finalTime += Math.floor((now.getTime() - startTime.getTime()) / 1000);
    segments.push({ start: run.startedAt, end: now.toISOString() });
  }
  
  const { pace, speed } = calculateRunStats(finalTime, distance);
  
  // Get current weight and calculate calories
  const weight = getCurrentWeight(data);
  const calories = weight > 0 ? calculateRunCalories(run.runType, weight, finalTime) : 0;
  
  return {
    ...data,
    runSessions: data.runSessions.map(r => {
      if (r.id !== runId) return r;
      return {
        ...r,
        timerStatus: 'completed',
        totalTime: finalTime,
        startedAt: undefined,
        segments,
        distance,
        pace,
        speed,
        calories,
        feeling: feeling as any,
        completed: true,
        completedAt: new Date().toISOString(),
      };
    }),
  };
};
