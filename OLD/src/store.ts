import { AppData, ExerciseTemplate, TrainingDay, Workout, WorkoutExercise, WorkoutSet } from './types';

const STORAGE_KEY = 'gym_app_data';

const generateId = () => Math.random().toString(36).substr(2, 9);

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

  return { templates, trainingDays, workouts, bodyWeight };
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
