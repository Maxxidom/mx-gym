import { useState, useEffect, useCallback } from 'react';
import {
  AppData,
  ExerciseTemplate,
  TrainingDay,
  WorkoutSet,
  ExerciseCategory,
} from './types';
import {
  loadData,
  saveData,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  createTrainingDay,
  updateTrainingDay,
  deleteTrainingDay,
  startWorkout,
  updateSet,
  addSetToExercise,
  deleteSet,
  deleteWorkout,
  getExerciseHistory,
  getLastWorkoutForExercise,
  roundWeight,
  getTodayDayOfWeek,
  WEEKDAYS,
  CATEGORY_INFO,
  addBodyWeight,
  deleteBodyWeight,
  getBodyWeightStats,
  addExerciseToWorkout,
  startExerciseTimer,
  pauseExerciseTimer,
  completeExerciseTimer,
  formatTime,
  formatTimeHMS,
  formatPace,
  startRunSession,
  pauseRunSession,
  resumeRunSession,
  updateRunSession,
  completeRunSession,
  deleteRunSession,
  getRunStats,
  RUN_TYPES,
  RUN_WEATHER,
  RUN_FEELINGS,
  updateUserProfile,
  getCurrentWeight,
  calculateWorkoutCalories,
  WORKOUT_INTENSITIES,
  WORKOUT_FEELINGS,
} from './store';
import { WorkoutIntensity } from './types';

// Theme colors - Modern Fitness App palette
const theme = {
  bg: {
    darkest: '#0a0a0b',
    dark: '#141416',
    medium: '#1c1c1f',
    light: '#252528',
    lighter: '#2a2a2d',
  },
  // Vibrant Electric Indigo accent
  accent: '#6366f1',
  accentLight: '#818cf8',
  accentDark: '#4f46e5',
  accentMuted: '#4338ca',
};

// SVG Icons
const Icons = {
  home: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  calendar: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  dumbbell: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5a2.5 2.5 0 0 1 3.5 0L17 13.5a2.5 2.5 0 0 1 0 3.5 2.5 2.5 0 0 1-3.5 0L6.5 10a2.5 2.5 0 0 1 0-3.5z"/>
      <path d="M3.5 9.5L5 8l1.5 1.5"/>
      <path d="M18.5 14.5L20 16l-1.5 1.5"/>
    </svg>
  ),
  scale: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8"/>
      <path d="M12 17v4"/>
      <path d="M7 4h10"/>
      <path d="M17 4v4a5 5 0 0 1-10 0V4"/>
      <circle cx="12" cy="13" r="1"/>
    </svg>
  ),
  chart: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  play: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  pause: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="4" height="16"/>
      <rect x="14" y="4" width="4" height="16"/>
    </svg>
  ),
  plus: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  minus: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  check: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  x: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  chevronRight: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  chevronLeft: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  history: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  trash: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  edit: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  search: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  trendUp: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  trendDown: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
      <polyline points="17 18 23 18 23 12"/>
    </svg>
  ),
  stable: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="15 8 19 12 15 16"/>
    </svg>
  ),
  timer: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 10"/>
    </svg>
  ),
  download: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  running: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="17" cy="4" r="2"/>
      <path d="M15 22V13l-4-1-2.5 4.5"/>
      <path d="M7 10l3.5 1.5L14 7l-3-1"/>
      <path d="M3 22l4-8"/>
    </svg>
  ),
  flag: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
      <line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
  ),
  settings: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  user: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  fire: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z"/>
    </svg>
  ),
};

type Screen = 'home' | 'workout' | 'exercise' | 'programs' | 'catalog' | 'stats' | 'weight' | 'addExercise' | 'editWorkout' | 'running' | 'activeRun' | 'settings' | 'finishWorkout';

// Confirm Modal Component
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'red' | 'teal' | 'green';
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ isOpen, title, message, confirmText = 'Да', cancelText = 'Отмена', confirmColor = 'red', onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;
  
  const colorClasses = {
    red: 'bg-red-600 active:bg-red-500',
    teal: `bg-[${theme.accent}] active:bg-[${theme.accentLight}]`,
    green: 'bg-green-600 active:bg-green-500',
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-6">
      <div className="rounded-3xl w-full max-w-sm overflow-hidden animate-scale-in" style={{ backgroundColor: theme.bg.dark }}>
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-400">{message}</p>
        </div>
        <div className="flex" style={{ borderTop: `1px solid ${theme.bg.medium}` }}>
          <button
            onClick={onCancel}
            className="flex-1 py-4 text-gray-400 font-semibold active:opacity-70"
            style={{ borderRight: `1px solid ${theme.bg.medium}` }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-4 text-white font-semibold ${colorClasses[confirmColor]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState<AppData>(loadData);
  const [screen, setScreen] = useState<Screen>('home');
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);
  const [addExerciseFilter, setAddExerciseFilter] = useState<ExerciseCategory | 'all'>('all');
  
  // PWA Install State
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  
  // Check if app is installed and listen for install prompt
  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }
    
    // Listen for install prompt
    const handleInstallable = () => {
      setShowInstallBanner(true);
    };
    
    const handleInstalled = () => {
      setShowInstallBanner(false);
      setIsInstalled(true);
    };
    
    // Check if prompt is already available
    if ((window as any).deferredPrompt) {
      setShowInstallBanner(true);
    }
    
    window.addEventListener('pwainstallable', handleInstallable);
    window.addEventListener('pwainstalled', handleInstalled);
    
    return () => {
      window.removeEventListener('pwainstallable', handleInstallable);
      window.removeEventListener('pwainstalled', handleInstalled);
    };
  }, []);
  
  const handleInstallClick = async () => {
    const deferredPrompt = (window as any).deferredPrompt;
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    (window as any).deferredPrompt = null;
  };
  
  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: 'red' | 'teal' | 'green';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showConfirm = (options: Omit<typeof confirmModal, 'isOpen'>) => {
    setConfirmModal({ ...options, isOpen: true });
  };

  const hideConfirm = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  // Timer tick effect
  const [, setTimerTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Сохранение данных
  useEffect(() => {
    saveData(data);
  }, [data]);

  // Проверка незавершённой тренировки
  useEffect(() => {
    const unfinished = data.workouts.find(w => !w.completed);
    if (unfinished) {
      setActiveWorkoutId(unfinished.id);
    }
  }, []);

  const activeWorkout = data.workouts.find(w => w.id === activeWorkoutId);
  const activeExercise = activeWorkout?.exercises.find(e => e.id === activeExerciseId);
  const todayDayOfWeek = getTodayDayOfWeek();
  const todayPrograms = data.trainingDays.filter(d => d.weekDays.includes(todayDayOfWeek));

  const getTemplate = useCallback((id: string) => data.templates.find(t => t.id === id), [data.templates]);

  // Calculate current timer for running exercise
  const getCurrentTime = (exercise: typeof activeExercise) => {
    if (!exercise) return 0;
    let time = exercise.totalTime;
    if (exercise.timerStatus === 'running' && exercise.startedAt) {
      const now = new Date();
      const start = new Date(exercise.startedAt);
      time += Math.floor((now.getTime() - start.getTime()) / 1000);
    }
    return time;
  };

  // Handlers
  const handleStartWorkout = (dayId?: string) => {
    const newData = startWorkout(data, dayId);
    setData(newData);
    const newWorkout = newData.workouts[newData.workouts.length - 1];
    setActiveWorkoutId(newWorkout.id);
    setScreen('workout');
  };

  // Finish workout state
  const [finishIntensity, setFinishIntensity] = useState<WorkoutIntensity>('moderate');
  const [finishFeeling, setFinishFeeling] = useState<string>('good');
  
  const handleFinishWorkout = () => {
    if (activeWorkoutId) {
      setScreen('finishWorkout');
    }
  };
  
  const handleConfirmFinishWorkout = () => {
    if (activeWorkoutId) {
      const workout = data.workouts.find(w => w.id === activeWorkoutId);
      if (workout) {
        // Calculate total time
        const totalTime = workout.exercises.reduce((sum, e) => sum + (e.totalTime || 0), 0);
        // Get current weight
        const weight = getCurrentWeight(data);
        // Calculate calories
        const calories = weight > 0 ? calculateWorkoutCalories(finishIntensity, weight, totalTime) : 0;
        
        setData(prev => ({
          ...prev,
          workouts: prev.workouts.map(w => 
            w.id === activeWorkoutId 
              ? { 
                  ...w, 
                  completed: true, 
                  completedAt: new Date().toISOString(),
                  intensity: finishIntensity,
                  feeling: finishFeeling as any,
                  calories,
                } 
              : w
          ),
        }));
      }
      setActiveWorkoutId(null);
      setActiveExerciseId(null);
      setFinishIntensity('moderate');
      setFinishFeeling('good');
      setScreen('home');
    }
  };

  const handleCancelWorkout = () => {
    showConfirm({
      title: 'Отменить тренировку?',
      message: 'Все данные будут потеряны.',
      confirmText: 'Отменить',
      confirmColor: 'red',
      onConfirm: () => {
        hideConfirm();
        if (activeWorkoutId) {
          setData(prev => deleteWorkout(prev, activeWorkoutId));
          setActiveWorkoutId(null);
          setActiveExerciseId(null);
          setScreen('home');
        }
      },
    });
  };

  // Timer handlers
  const handleStartTimer = () => {
    if (!activeWorkoutId || !activeExerciseId) return;
    setData(prev => startExerciseTimer(prev, activeWorkoutId, activeExerciseId));
  };

  const handlePauseTimer = () => {
    if (!activeWorkoutId || !activeExerciseId) return;
    setData(prev => pauseExerciseTimer(prev, activeWorkoutId, activeExerciseId));
    setScreen('workout');
    setActiveExerciseId(null);
  };

  const handleCompleteExercise = () => {
    if (!activeWorkoutId || !activeExerciseId) return;
    setData(prev => completeExerciseTimer(prev, activeWorkoutId, activeExerciseId));
    setScreen('workout');
    setActiveExerciseId(null);
  };

  const handleUpdateSet = (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => {
    if (!activeWorkoutId) return;
    if (updates.weight !== undefined) {
      updates.weight = roundWeight(updates.weight);
    }
    setData(prev => updateSet(prev, activeWorkoutId, exerciseId, setId, updates));
  };

  const handleAddSet = (exerciseId: string) => {
    if (!activeWorkoutId) return;
    setData(prev => addSetToExercise(prev, activeWorkoutId, exerciseId));
  };

  const handleDeleteSet = (exerciseId: string, setId: string) => {
    if (!activeWorkoutId) return;
    setData(prev => deleteSet(prev, activeWorkoutId, exerciseId, setId));
  };
  
  const handleAddExerciseToWorkout = (templateId: string) => {
    if (!activeWorkoutId) return;
    setData(prev => addExerciseToWorkout(prev, activeWorkoutId, templateId));
    setScreen('workout');
  };

  // Render navigation
  const renderNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-xl px-1 pb-safe z-50" style={{ backgroundColor: `${theme.bg.darkest}ee`, borderTop: `1px solid ${theme.bg.medium}` }}>
      <div className="flex justify-around py-1">
        {[
          { id: 'home', icon: Icons.home, label: 'Главная' },
          { id: 'programs', icon: Icons.calendar, label: 'Программы' },
          { id: 'running', icon: Icons.running, label: 'Бег' },
          { id: 'weight', icon: Icons.scale, label: 'Вес' },
          { id: 'stats', icon: Icons.chart, label: 'Прогресс' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id as Screen)}
            className={`flex flex-col items-center py-2 px-3 rounded-2xl transition-all ${
              screen === item.id 
                ? 'text-white' 
                : 'text-gray-500'
            }`}
          >
            <span style={{ color: screen === item.id ? theme.accent : undefined }}>{item.icon}</span>
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );

  // Home Screen
  const renderHome = () => (
    <div className="min-h-screen text-white pb-28" style={{ backgroundColor: theme.bg.darkest }}>
      <header className="px-5 pt-4 pb-4">
        <p className="text-gray-400 text-sm font-medium">
          {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mt-1">Тренировка</h1>
          <button 
            onClick={() => setScreen('settings')}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: theme.bg.dark, color: 'gray' }}
          >
            {Icons.settings}
          </button>
        </div>
      </header>
      
      {/* PWA Install Banner */}
      {showInstallBanner && !isInstalled && (
        <div className="mx-5 mb-4">
          <div 
            className="rounded-2xl p-4 flex items-center gap-4"
            style={{ background: `linear-gradient(135deg, ${theme.accentDark} 0%, ${theme.accentMuted} 100%)` }}
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              {Icons.download}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold">Установить приложение</p>
              <p className="text-sm text-indigo-200">Быстрый доступ с главного экрана</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setShowInstallBanner(false)}
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center"
              >
                {Icons.x}
              </button>
              <button
                onClick={handleInstallClick}
                className="px-4 py-2 bg-white text-indigo-600 font-bold rounded-lg"
              >
                Установить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Workout Banner */}
      {activeWorkout && !activeWorkout.completed && (
        <div className="mx-5 mb-6">
          <button
            onClick={() => setScreen('workout')}
            className="w-full rounded-2xl p-5 text-left shadow-lg"
            style={{ background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentDark} 100%)` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium uppercase tracking-wide">Продолжить</p>
                <p className="text-white text-2xl font-bold mt-1">
                  {activeWorkout.exercises.filter(e => e.completed).length}/{activeWorkout.exercises.length}
                </p>
                <p className="text-teal-100 text-sm">упражнений выполнено</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                {Icons.play}
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Today's Programs */}
      <section className="px-5 mb-6">
        <h2 className="text-lg font-bold mb-4">Сегодня</h2>
        {todayPrograms.length > 0 ? (
          <div className="space-y-3">
            {todayPrograms.map(program => (
              <div
                key={program.id}
                className="rounded-2xl p-5"
                style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">{program.name}</h3>
                  <span className="text-gray-400 text-sm">{program.exerciseIds.length} упр.</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {program.exerciseIds.slice(0, 3).map(id => {
                    const t = getTemplate(id);
                    return t ? (
                      <span key={id} className="text-gray-300 text-xs px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: theme.bg.medium }}>
                        {t.name}
                      </span>
                    ) : null;
                  })}
                  {program.exerciseIds.length > 3 && (
                    <span className="text-gray-500 text-xs px-2 py-1">
                      +{program.exerciseIds.length - 3}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleStartWorkout(program.id)}
                  disabled={!!activeWorkout}
                  className="w-full text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                  style={{ backgroundColor: activeWorkout ? theme.bg.medium : theme.accent }}
                >
                  {activeWorkout ? 'Завершите текущую' : 'Начать'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: theme.bg.medium }}>
              {Icons.calendar}
            </div>
            <p className="text-gray-400 font-medium">Нет тренировок на сегодня</p>
            <button
              onClick={() => setScreen('programs')}
              className="font-semibold mt-2"
              style={{ color: theme.accent }}
            >
              Создать программу
            </button>
          </div>
        )}
      </section>

      {/* Quick Start */}
      {!activeWorkout && (
        <section className="px-5 mb-6">
          <button
            onClick={() => handleStartWorkout()}
            className="w-full rounded-2xl p-5 active:scale-[0.98] transition-transform"
            style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: theme.bg.medium, color: theme.accent }}>
                {Icons.plus}
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Свободная тренировка</p>
                <p className="text-gray-500 text-sm">Начать без программы</p>
              </div>
            </div>
          </button>
        </section>
      )}

      {/* Recent Workouts */}
      <section className="px-5">
        <h2 className="text-lg font-bold mb-4">История</h2>
        {data.workouts.filter(w => w.completed).length > 0 ? (
          <div className="space-y-2">
            {data.workouts
              .filter(w => w.completed)
              .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
              .slice(0, 5)
              .map(workout => {
                const day = data.trainingDays.find(d => d.id === workout.dayId);
                const totalSets = workout.exercises.reduce((sum, e) => sum + e.sets.filter(s => s.completed).length, 0);
                const totalTime = workout.exercises.reduce((sum, e) => sum + (e.totalTime || 0), 0);
                const intensityInfo = workout.intensity ? WORKOUT_INTENSITIES[workout.intensity] : null;
                const feelingInfo = workout.feeling ? WORKOUT_FEELINGS[workout.feeling] : null;
                return (
                  <button
                    key={workout.id}
                    onClick={() => {
                      setEditingWorkoutId(workout.id);
                      setScreen('editWorkout');
                    }}
                    className="w-full rounded-2xl p-4 text-left active:scale-[0.98] transition-transform"
                    style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-bold text-lg">{day?.name || 'Свободная тренировка'}</p>
                        <p className="text-gray-500 text-sm mt-0.5">
                          {new Date(workout.completedAt!).toLocaleDateString('ru-RU', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })}
                          {totalTime > 0 && ` • ${formatTime(totalTime)}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {feelingInfo && <span className="text-2xl">{feelingInfo.emoji}</span>}
                        <span className="text-gray-600">{Icons.chevronRight}</span>
                      </div>
                    </div>
                    
                    {/* Stats row */}
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2.5 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: theme.bg.medium }}>
                        📊 {totalSets} подходов
                      </span>
                      {workout.calories && workout.calories > 0 && (
                        <span className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-orange-500/20 text-orange-400">
                          🔥 {workout.calories} ккал
                        </span>
                      )}
                      {intensityInfo && (
                        <span 
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium"
                          style={{ backgroundColor: `${intensityInfo.color}30`, color: intensityInfo.color }}
                        >
                          {intensityInfo.emoji} {intensityInfo.label}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Пока нет тренировок</p>
        )}
      </section>
    </div>
  );

  // Edit Workout Screen (for completed workouts)
  const renderEditWorkout = () => {
    const workout = data.workouts.find(w => w.id === editingWorkoutId);
    if (!workout) return null;

    const day = data.trainingDays.find(d => d.id === workout.dayId);

    return (
      <div className="min-h-screen text-white pb-8" style={{ backgroundColor: theme.bg.darkest }}>
        <header className="sticky top-0 backdrop-blur-xl z-40 px-5 pt-4 pb-3" style={{ backgroundColor: `${theme.bg.darkest}ee`, borderBottom: `1px solid ${theme.bg.medium}` }}>
          <div className="flex items-center justify-between">
            <button 
              onClick={() => {
                setEditingWorkoutId(null);
                setScreen('home');
              }}
              className="font-semibold flex items-center gap-1"
              style={{ color: theme.accent }}
            >
              {Icons.chevronLeft} Назад
            </button>
            <h1 className="text-lg font-bold">Редактировать</h1>
            <button
              onClick={() => {
                showConfirm({
                  title: 'Удалить тренировку?',
                  message: 'Эта тренировка будет удалена из истории.',
                  confirmText: 'Удалить',
                  confirmColor: 'red',
                  onConfirm: () => {
                    hideConfirm();
                    setData(prev => deleteWorkout(prev, workout.id));
                    setEditingWorkoutId(null);
                    setScreen('home');
                  },
                });
              }}
              className="text-red-500"
            >
              {Icons.trash}
            </button>
          </div>
        </header>

        <div className="px-5 py-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{day?.name || 'Свободная'}</h2>
            <p className="text-gray-400 mt-1">
              {new Date(workout.completedAt!).toLocaleDateString('ru-RU', { 
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
              })}
            </p>
          </div>

          <div className="space-y-4">
            {workout.exercises.map(exercise => {
              const template = getTemplate(exercise.templateId);
              if (!template) return null;
              const category = CATEGORY_INFO[template.category];

              return (
                <div key={exercise.id} className="rounded-2xl p-5" style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span 
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ backgroundColor: category.bg, color: category.color }}
                    >
                      {template.machineNumber}
                    </span>
                    <h3 className="font-bold">{template.name}</h3>
                    {exercise.totalTime > 0 && (
                      <span className="text-gray-500 text-sm ml-auto">{formatTime(exercise.totalTime)}</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {exercise.sets.map((set, index) => (
                      <div key={set.id} className="flex items-center gap-4 rounded-xl p-3" style={{ backgroundColor: theme.bg.medium }}>
                        <span className="text-gray-400 font-medium w-8">{index + 1}</span>
                        <div className="flex-1 flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              inputMode="numeric"
                              value={set.reps}
                              onChange={(e) => {
                                const newReps = parseInt(e.target.value) || 0;
                                setData(prev => ({
                                  ...prev,
                                  workouts: prev.workouts.map(w => 
                                    w.id === workout.id 
                                      ? {
                                          ...w,
                                          exercises: w.exercises.map(ex => 
                                            ex.id === exercise.id 
                                              ? { ...ex, sets: ex.sets.map(s => s.id === set.id ? { ...s, reps: newReps } : s) }
                                              : ex
                                          ),
                                        }
                                      : w
                                  ),
                                }));
                              }}
                              className="w-14 rounded-lg px-2 py-2 text-center font-bold outline-none"
                              style={{ backgroundColor: theme.bg.light }}
                            />
                            <span className="text-gray-400 text-sm">повт</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              inputMode="decimal"
                              step="0.5"
                              value={set.weight}
                              onChange={(e) => {
                                const newWeight = roundWeight(parseFloat(e.target.value) || 0);
                                setData(prev => ({
                                  ...prev,
                                  workouts: prev.workouts.map(w => 
                                    w.id === workout.id 
                                      ? {
                                          ...w,
                                          exercises: w.exercises.map(ex => 
                                            ex.id === exercise.id 
                                              ? { ...ex, sets: ex.sets.map(s => s.id === set.id ? { ...s, weight: newWeight } : s) }
                                              : ex
                                          ),
                                        }
                                      : w
                                  ),
                                }));
                              }}
                              className="w-16 rounded-lg px-2 py-2 text-center font-bold outline-none"
                              style={{ backgroundColor: theme.bg.light }}
                            />
                            <span className="text-gray-400 text-sm">кг</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Workout Screen
  const renderWorkout = () => {
    if (!activeWorkout) return null;

    const completedCount = activeWorkout.exercises.filter(e => e.completed).length;
    const progress = activeWorkout.exercises.length > 0 
      ? (completedCount / activeWorkout.exercises.length) * 100 
      : 0;

    const pausedExercise = activeWorkout.exercises.find(e => e.timerStatus === 'paused');

    return (
      <div className="min-h-screen text-white pb-8" style={{ backgroundColor: theme.bg.darkest }}>
        <header className="sticky top-0 backdrop-blur-xl z-40 px-5 pt-4 pb-3" style={{ backgroundColor: `${theme.bg.darkest}ee`, borderBottom: `1px solid ${theme.bg.medium}` }}>
          <div className="flex items-center justify-between mb-3">
            <button onClick={handleCancelWorkout} className="text-red-500 font-semibold">
              Отмена
            </button>
            <h1 className="text-lg font-bold">Тренировка</h1>
            <button 
              onClick={handleFinishWorkout}
              className="text-green-500 font-semibold"
            >
              Готово
            </button>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: theme.bg.medium }}>
            <div 
              className="h-full transition-all duration-500"
              style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${theme.accent} 0%, #10b981 100%)` }}
            />
          </div>
          <p className="text-center text-gray-500 text-sm mt-2">
            {completedCount} из {activeWorkout.exercises.length} выполнено
          </p>
        </header>

        {pausedExercise && (
          <div className="mx-5 mt-4">
            <button
              onClick={() => {
                setActiveExerciseId(pausedExercise.id);
                setScreen('exercise');
              }}
              className="w-full rounded-xl p-4 text-left"
              style={{ background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(249, 115, 22, 0.2) 100%)', border: '1px solid rgba(234, 179, 8, 0.5)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                  {Icons.pause}
                </div>
                <div className="flex-1">
                  <p className="text-yellow-500 text-xs font-medium uppercase">Отложено</p>
                  <p className="font-bold">{getTemplate(pausedExercise.templateId)?.name}</p>
                </div>
                <span className="text-yellow-500 font-bold">{formatTime(pausedExercise.totalTime)}</span>
              </div>
            </button>
          </div>
        )}

        <div className="px-5 py-4 space-y-3">
          {activeWorkout.exercises
            .sort((a, b) => a.order - b.order)
            .map((exercise, index) => {
              const template = getTemplate(exercise.templateId);
              if (!template) return null;
              const category = CATEGORY_INFO[template.category];
              const completedSets = exercise.sets.filter(s => s.completed).length;
              const maxWeight = Math.max(...exercise.sets.map(s => s.weight), 0);
              const isPaused = exercise.timerStatus === 'paused';
              const isRunning = exercise.timerStatus === 'running';

              return (
                <button
                  key={exercise.id}
                  onClick={() => {
                    setActiveExerciseId(exercise.id);
                    setScreen('exercise');
                  }}
                  className="w-full text-left rounded-2xl p-4 transition-all active:scale-[0.98]"
                  style={{
                    backgroundColor: exercise.completed ? 'rgba(16, 185, 129, 0.1)' : isPaused ? 'rgba(234, 179, 8, 0.1)' : isRunning ? `${theme.accent}15` : theme.bg.dark,
                    border: `1px solid ${exercise.completed ? 'rgba(16, 185, 129, 0.3)' : isPaused ? 'rgba(234, 179, 8, 0.3)' : isRunning ? theme.accent + '50' : theme.bg.medium}`
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                      style={{
                        backgroundColor: exercise.completed ? '#10b981' : isPaused ? '#eab308' : isRunning ? theme.accent : theme.bg.medium,
                        color: exercise.completed || isPaused || isRunning ? 'white' : 'gray'
                      }}
                    >
                      {exercise.completed ? Icons.check : isPaused ? Icons.pause : index + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className="text-xs font-bold px-2 py-0.5 rounded"
                          style={{ backgroundColor: category.bg, color: category.color }}
                        >
                          {template.machineNumber}
                        </span>
                        {(exercise.totalTime > 0 || isRunning) && (
                          <span className="text-gray-500 text-xs">{formatTime(getCurrentTime(exercise))}</span>
                        )}
                      </div>
                      <h3 className="font-bold truncate">{template.name}</h3>
                      <p className="text-gray-500 text-sm mt-0.5">
                        {completedSets}/{exercise.sets.length} подходов
                        {maxWeight > 0 && ` • ${maxWeight} кг`}
                      </p>
                    </div>

                    <span className="text-gray-600">{Icons.chevronRight}</span>
                  </div>
                </button>
              );
            })}

          <button
            onClick={() => setScreen('addExercise')}
            className="w-full py-4 border-2 border-dashed rounded-2xl text-gray-400 font-semibold flex items-center justify-center gap-2"
            style={{ borderColor: theme.bg.light }}
          >
            {Icons.plus}
            <span>Добавить упражнение</span>
          </button>
        </div>
      </div>
    );
  };
  
  // Add Exercise to Workout Screen
  const renderAddExercise = () => {
    if (!activeWorkout) {
      return (
        <div className="min-h-screen text-white flex items-center justify-center" style={{ backgroundColor: theme.bg.darkest }}>
          <div className="text-center">
            <p className="text-gray-400 mb-4">Нет активной тренировки</p>
            <button 
              onClick={() => setScreen('home')}
              className="font-semibold"
              style={{ color: theme.accent }}
            >
              На главную
            </button>
          </div>
        </div>
      );
    }
    
    const filtered = data.templates.filter(t => {
      if (addExerciseFilter !== 'all' && t.category !== addExerciseFilter) return false;
      if (activeWorkout.exercises.some(e => e.templateId === t.id)) return false;
      return true;
    });
    
    return (
      <div className="min-h-screen text-white pb-8" style={{ backgroundColor: theme.bg.darkest }}>
        <header className="sticky top-0 backdrop-blur-xl z-40 px-5 pt-4 pb-3" style={{ backgroundColor: `${theme.bg.darkest}ee`, borderBottom: `1px solid ${theme.bg.medium}` }}>
          <div className="flex items-center justify-between">
            <button onClick={() => setScreen('workout')} className="font-semibold flex items-center gap-1" style={{ color: theme.accent }}>
              {Icons.chevronLeft} Назад
            </button>
            <h1 className="text-lg font-bold">Добавить</h1>
            <div className="w-16" />
          </div>
          
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 -mx-5 px-5">
            {[
              { id: 'all', label: 'Все' },
              { id: 'cardio', label: 'Кардио' },
              { id: 'machine', label: 'Тренажёры' },
              { id: 'free_weights', label: 'Свободные' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setAddExerciseFilter(f.id as ExerciseCategory | 'all')}
                className="px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all"
                style={{
                  backgroundColor: addExerciseFilter === f.id ? theme.accent : theme.bg.medium,
                  color: addExerciseFilter === f.id ? 'white' : 'gray'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </header>
        
        <div className="px-5 py-4 space-y-2">
          {filtered.map(t => {
            const cat = CATEGORY_INFO[t.category];
            const lastWorkout = getLastWorkoutForExercise(data, t.id);
            return (
              <button
                key={t.id}
                onClick={() => handleAddExerciseToWorkout(t.id)}
                className="w-full rounded-xl p-4 text-left active:scale-[0.98] transition-transform"
                style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="text-xs font-bold px-2 py-1 rounded"
                    style={{ backgroundColor: cat.bg, color: cat.color }}
                  >
                    {t.machineNumber}
                  </span>
                  <div className="flex-1">
                    <span className="font-semibold">{t.name}</span>
                    {lastWorkout && (
                      <p className="text-gray-500 text-xs mt-1">
                        Посл: {lastWorkout.sets.map(s => `${s.reps}×${s.weight}`).join(', ')}
                      </p>
                    )}
                  </div>
                  <span style={{ color: theme.accent }}>{Icons.plus}</span>
                </div>
              </button>
            );
          })}
          
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Нет доступных упражнений</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Exercise Screen (Full-screen modal) - Compact layout
  const [showLastWorkout, setShowLastWorkout] = useState(false);
  
  const renderExercise = () => {
    if (!activeWorkout) {
      if (screen === 'exercise') {
        setTimeout(() => setScreen('home'), 0);
      }
      return null;
    }
    
    if (!activeExercise) {
      if (screen === 'exercise') {
        setTimeout(() => setScreen('workout'), 0);
      }
      return null;
    }
    
    const template = getTemplate(activeExercise.templateId);
    if (!template) return null;
    
    const category = CATEGORY_INFO[template.category];
    const lastWorkout = getLastWorkoutForExercise(data, activeExercise.templateId);
    const allCompleted = activeExercise.sets.every(s => s.completed);
    const currentTime = getCurrentTime(activeExercise);
    const timerStatus = activeExercise.timerStatus;

    return (
      <div className="fixed inset-0 text-white z-50 flex flex-col" style={{ backgroundColor: theme.bg.darkest }}>
        {/* Compact Header */}
        <header className="px-4 pt-12 pb-3 flex-shrink-0" style={{ borderBottom: `1px solid ${theme.bg.medium}` }}>
          {/* Top row - back, title area, history */}
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={() => {
                setActiveExerciseId(null);
                setShowLastWorkout(false);
                setTimeout(() => setScreen('workout'), 0);
              }}
              className="font-semibold flex items-center text-sm"
              style={{ color: theme.accent }}
            >
              {Icons.chevronLeft} Назад
            </button>
            <div className="flex items-center gap-2">
              {lastWorkout && (
                <button
                  onClick={() => setShowLastWorkout(!showLastWorkout)}
                  className="text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1"
                  style={{ 
                    backgroundColor: showLastWorkout ? theme.accent : theme.bg.medium,
                    color: showLastWorkout ? 'white' : 'gray'
                  }}
                >
                  {Icons.history}
                  Посл.
                </button>
              )}
              <button
                onClick={() => setShowHistory(activeExercise.templateId)}
                className="text-gray-400 p-1"
              >
                {Icons.chart}
              </button>
            </div>
          </div>
          
          {/* Title row - name and machine number on same line */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold truncate flex-1 mr-3">{template.name}</h1>
            <span 
              className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.bg, color: category.color }}
            >
              {template.machineNumber}
            </span>
          </div>
          
          {/* Timer row - compact */}
          <div className="mt-3 flex items-center justify-between rounded-xl p-3" style={{ backgroundColor: theme.bg.dark }}>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: timerStatus === 'running' ? theme.accent : timerStatus === 'paused' ? '#eab308' : timerStatus === 'completed' ? '#10b981' : theme.bg.medium
                }}
              >
                <span className="scale-75">{Icons.timer}</span>
              </div>
              <div>
                <p className="text-xl font-bold font-mono leading-none">{formatTime(currentTime)}</p>
                <p className="text-gray-500 text-xs">
                  {timerStatus === 'running' ? 'В процессе' :
                   timerStatus === 'paused' ? 'Отложено' :
                   timerStatus === 'completed' ? 'Завершено' : 'Не начато'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {timerStatus === 'idle' && (
                <button
                  onClick={handleStartTimer}
                  className="text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1"
                  style={{ backgroundColor: theme.accent }}
                >
                  <span className="scale-75">{Icons.play}</span>
                  Начать
                </button>
              )}
              {timerStatus === 'running' && (
                <button
                  onClick={handlePauseTimer}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1"
                >
                  <span className="scale-75">{Icons.pause}</span>
                  Отложить
                </button>
              )}
              {timerStatus === 'paused' && (
                <button
                  onClick={handleStartTimer}
                  className="text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1"
                  style={{ backgroundColor: theme.accent }}
                >
                  <span className="scale-75">{Icons.play}</span>
                  Продолжить
                </button>
              )}
            </div>
          </div>
        </header>
        
        {/* Last workout popup */}
        {showLastWorkout && lastWorkout && (
          <div className="px-4 py-2 flex-shrink-0" style={{ backgroundColor: theme.bg.dark, borderBottom: `1px solid ${theme.bg.medium}` }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-xs font-medium uppercase">Последняя тренировка</p>
              <button onClick={() => setShowLastWorkout(false)} className="text-gray-500 p-1">
                <span className="scale-75">{Icons.x}</span>
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {lastWorkout.sets.map((s, i) => (
                <div key={i} className="rounded-lg px-3 py-1.5 text-center flex-shrink-0" style={{ backgroundColor: theme.bg.medium }}>
                  <span className="font-bold">{s.weight}</span>
                  <span className="text-gray-400 text-xs ml-1">кг</span>
                  <span className="text-gray-500 mx-1">×</span>
                  <span className="font-bold">{s.reps}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sets - main scrollable area */}
        <div className="flex-1 overflow-auto px-4 py-3">
          <div className="space-y-3">
            {activeExercise.sets.map((set, index) => (
              <div
                key={set.id}
                className="rounded-xl p-4 transition-all"
                style={{
                  backgroundColor: set.completed ? 'rgba(16, 185, 129, 0.1)' : theme.bg.dark,
                  border: `1px solid ${set.completed ? 'rgba(16, 185, 129, 0.3)' : theme.bg.medium}`
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 font-bold">Подход {index + 1}</span>
                  <div className="flex items-center">
                    {activeExercise.sets.length > 1 && (
                      <button
                        onClick={() => {
                          showConfirm({
                            title: 'Удалить подход?',
                            message: `Подход ${index + 1} будет удалён.`,
                            confirmText: 'Удалить',
                            confirmColor: 'red',
                            onConfirm: () => {
                              hideConfirm();
                              handleDeleteSet(activeExercise.id, set.id);
                            },
                          });
                        }}
                        className="text-gray-600 active:text-red-500 p-2 mr-4"
                      >
                        <span className="scale-75">{Icons.trash}</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleUpdateSet(activeExercise.id, set.id, { completed: !set.completed })}
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                      style={{
                        backgroundColor: set.completed ? '#10b981' : theme.bg.medium,
                        color: set.completed ? 'white' : 'gray'
                      }}
                    >
                      {set.completed ? Icons.check : <span className="w-5 h-5 rounded border-2 border-gray-500"></span>}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Reps */}
                  <div>
                    <label className="text-gray-500 text-xs font-medium block mb-1.5 text-center uppercase">Повторы</label>
                    <div className="flex items-center rounded-xl" style={{ backgroundColor: theme.bg.medium }}>
                      <button
                        onClick={() => handleUpdateSet(activeExercise.id, set.id, { reps: Math.max(0, set.reps - 1) })}
                        className="w-12 h-12 flex items-center justify-center rounded-l-xl flex-shrink-0"
                        style={{ color: theme.accent }}
                      >
                        {Icons.minus}
                      </button>
                      <div className="input-wrap">
                        <input
                          type="number"
                          inputMode="numeric"
                          value={set.reps}
                          onChange={(e) => handleUpdateSet(activeExercise.id, set.id, { reps: parseInt(e.target.value) || 0 })}
                          className="w-12 max-w-12 bg-transparent text-center text-xl font-bold outline-none"
                          style={{ textAlign: 'center' }}
                        />
                      </div>
                      <button
                        onClick={() => handleUpdateSet(activeExercise.id, set.id, { reps: set.reps + 1 })}
                        className="w-12 h-12 flex items-center justify-center rounded-r-xl flex-shrink-0"
                        style={{ color: theme.accent }}
                      >
                        {Icons.plus}
                      </button>
                    </div>
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="text-gray-500 text-xs font-medium block mb-1.5 text-center uppercase">Вес (кг)</label>
                    <div className="flex items-center rounded-xl" style={{ backgroundColor: theme.bg.medium }}>
                      <button
                        onClick={() => handleUpdateSet(activeExercise.id, set.id, { weight: Math.max(0, set.weight - 2.5) })}
                        className="w-12 h-12 flex items-center justify-center text-orange-400 rounded-l-xl flex-shrink-0"
                      >
                        {Icons.minus}
                      </button>
                      <div className="input-wrap">
                        <input
                          type="number"
                          inputMode="decimal"
                          step="0.5"
                          value={set.weight}
                          onChange={(e) => handleUpdateSet(activeExercise.id, set.id, { weight: parseFloat(e.target.value) || 0 })}
                          className="w-14 max-w-14 bg-transparent text-center text-xl font-bold outline-none"
                          style={{ textAlign: 'center' }}
                        />
                      </div>
                      <button
                        onClick={() => handleUpdateSet(activeExercise.id, set.id, { weight: set.weight + 2.5 })}
                        className="w-12 h-12 flex items-center justify-center text-orange-400 rounded-r-xl flex-shrink-0"
                      >
                        {Icons.plus}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleAddSet(activeExercise.id)}
            className="w-full mt-3 py-3 border-2 border-dashed rounded-xl text-gray-400 font-semibold flex items-center justify-center gap-2 text-sm"
            style={{ borderColor: theme.bg.light }}
          >
            {Icons.plus}
            Добавить подход
          </button>
        </div>

        {/* Bottom button */}
        <div className="p-4 flex-shrink-0" style={{ borderTop: `1px solid ${theme.bg.medium}` }}>
          <button
            onClick={handleCompleteExercise}
            disabled={!allCompleted}
            className="w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
            style={{
              backgroundColor: allCompleted ? '#10b981' : theme.bg.medium,
              color: allCompleted ? 'white' : 'gray'
            }}
          >
            {allCompleted && Icons.check}
            {activeExercise.completed ? 'Упражнение завершено' : 'Завершить упражнение'}
          </button>
        </div>
      </div>
    );
  };

  // History Modal
  const renderHistory = () => {
    if (!showHistory) return null;
    
    const template = getTemplate(showHistory);
    if (!template) return null;
    
    const history = getExerciseHistory(data, showHistory);

    return (
      <div className="fixed inset-0 z-[60] overflow-auto" style={{ backgroundColor: theme.bg.darkest }}>
        <header className="sticky top-0 px-5 pt-4 pb-3" style={{ backgroundColor: theme.bg.darkest, borderBottom: `1px solid ${theme.bg.medium}` }}>
          <div className="flex items-center justify-between">
            <button onClick={() => setShowHistory(null)} className="font-semibold flex items-center gap-1" style={{ color: theme.accent }}>
              {Icons.chevronLeft} Закрыть
            </button>
          </div>
          <h1 className="text-xl font-bold mt-3">История: {template.name}</h1>
        </header>

        <div className="px-5 py-4 space-y-4">
          {history.length > 0 ? (
            history.map(workout => {
              const exercise = workout.exercises.find(e => e.templateId === showHistory);
              if (!exercise) return null;
              
              return (
                <div key={workout.id} className="rounded-2xl p-5" style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-400 text-sm font-medium">
                      {new Date(workout.completedAt!).toLocaleDateString('ru-RU', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                    {exercise.totalTime > 0 && (
                      <span className="text-gray-500 text-sm">{formatTime(exercise.totalTime)}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {exercise.sets.filter(s => s.completed).map((set, i) => (
                      <div key={i} className="rounded-xl px-3 py-3 text-center" style={{ backgroundColor: theme.bg.medium }}>
                        <p className="font-bold text-lg">{set.weight} <span className="text-sm text-gray-400">кг</span></p>
                        <p className="text-gray-400 text-sm">{set.reps} повт.</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: theme.bg.dark }}>
                {Icons.history}
              </div>
              <p className="text-gray-500">Нет истории</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Programs Screen
  const [editingDay, setEditingDay] = useState<TrainingDay | null>(null);
  const [showDayEditor, setShowDayEditor] = useState(false);
  const [newDayName, setNewDayName] = useState('');
  const [newDayWeekDays, setNewDayWeekDays] = useState<number[]>([]);
  const [newDayExercises, setNewDayExercises] = useState<string[]>([]);

  const handleSaveDay = () => {
    if (!newDayName.trim()) return;
    
    if (editingDay) {
      setData(prev => updateTrainingDay(prev, editingDay.id, {
        name: newDayName,
        weekDays: newDayWeekDays,
        exerciseIds: newDayExercises,
      }));
    } else {
      setData(prev => createTrainingDay(prev, {
        name: newDayName,
        weekDays: newDayWeekDays,
        exerciseIds: newDayExercises,
      }));
    }
    
    setShowDayEditor(false);
    setEditingDay(null);
    setNewDayName('');
    setNewDayWeekDays([]);
    setNewDayExercises([]);
  };

  const renderPrograms = () => (
    <div className="min-h-screen text-white pb-28" style={{ backgroundColor: theme.bg.darkest }}>
      <header className="px-5 pt-4 pb-4">
        <h1 className="text-2xl font-bold">Программы</h1>
        <p className="text-gray-400 mt-1">Ваши тренировочные дни</p>
      </header>

      <div className="px-5 space-y-4">
        {data.trainingDays.map(day => (
          <div key={day.id} className="rounded-2xl p-5" style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex-1">{day.name}</h3>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => {
                    setEditingDay(day);
                    setNewDayName(day.name);
                    setNewDayWeekDays(day.weekDays);
                    setNewDayExercises(day.exerciseIds);
                    setShowDayEditor(true);
                  }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: theme.bg.medium, color: theme.accent }}
                >
                  {Icons.edit}
                </button>
                <button
                  onClick={() => {
                    showConfirm({
                      title: 'Удалить программу?',
                      message: `"${day.name}" будет удалена.`,
                      confirmText: 'Удалить',
                      confirmColor: 'red',
                      onConfirm: () => {
                        hideConfirm();
                        setData(prev => deleteTrainingDay(prev, day.id));
                      },
                    });
                  }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/20 text-red-500"
                >
                  {Icons.trash}
                </button>
              </div>
            </div>
            
            <div className="flex gap-1.5 mb-4">
              {WEEKDAYS.map((wd, i) => (
                <span
                  key={i}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: day.weekDays.includes(i + 1) ? theme.accent : theme.bg.medium,
                    color: day.weekDays.includes(i + 1) ? 'white' : 'gray'
                  }}
                >
                  {wd}
                </span>
              ))}
            </div>
            
            <div className="space-y-2">
              {day.exerciseIds.slice(0, 4).map((id, index) => {
                const t = getTemplate(id);
                if (!t) return null;
                const cat = CATEGORY_INFO[t.category];
                return (
                  <div key={id} className="flex items-center gap-3 rounded-xl px-4 py-2.5" style={{ backgroundColor: theme.bg.medium }}>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: theme.bg.light }}>
                      {index + 1}
                    </span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ backgroundColor: cat.bg, color: cat.color }}
                    >
                      {t.machineNumber}
                    </span>
                    <span className="text-sm font-medium">{t.name}</span>
                  </div>
                );
              })}
              {day.exerciseIds.length > 4 && (
                <p className="text-gray-500 text-sm pl-4">+ ещё {day.exerciseIds.length - 4}</p>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={() => {
            setEditingDay(null);
            setNewDayName('');
            setNewDayWeekDays([]);
            setNewDayExercises([]);
            setShowDayEditor(true);
          }}
          className="w-full py-5 border-2 border-dashed rounded-2xl text-gray-400 font-semibold flex items-center justify-center gap-2"
          style={{ borderColor: theme.bg.light }}
        >
          {Icons.plus}
          Создать программу
        </button>
      </div>

      {/* Edit Modal */}
      {showDayEditor && (
        <div className="fixed inset-0 z-50 overflow-auto" style={{ backgroundColor: theme.bg.darkest }}>
          <header className="sticky top-0 px-5 pt-4 pb-3" style={{ backgroundColor: theme.bg.darkest, borderBottom: `1px solid ${theme.bg.medium}` }}>
            <div className="flex items-center justify-between">
              <button 
                onClick={() => {
                  setShowDayEditor(false);
                  setEditingDay(null);
                }}
                className="text-red-500 font-semibold"
              >
                Отмена
              </button>
              <h1 className="font-bold">{editingDay ? 'Редактировать' : 'Новая программа'}</h1>
              <button onClick={handleSaveDay} className="font-semibold" style={{ color: theme.accent }}>
                Сохранить
              </button>
            </div>
          </header>

          <div className="px-5 py-6 space-y-6">
            <div>
              <label className="text-gray-400 text-sm font-medium block mb-2">Название</label>
              <input
                type="text"
                value={newDayName}
                onChange={(e) => setNewDayName(e.target.value)}
                placeholder="Например: Грудь + Трицепс"
                className="w-full rounded-xl px-4 py-4 outline-none text-lg"
                style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.light}` }}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm font-medium block mb-3">Дни недели</label>
              <div className="grid grid-cols-7 gap-2">
                {WEEKDAYS.map((wd, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const day = i + 1;
                      setNewDayWeekDays(prev => 
                        prev.includes(day) 
                          ? prev.filter(d => d !== day)
                          : [...prev, day]
                      );
                    }}
                    className="py-4 rounded-xl font-bold transition-all"
                    style={{
                      backgroundColor: newDayWeekDays.includes(i + 1) ? theme.accent : theme.bg.medium,
                      color: newDayWeekDays.includes(i + 1) ? 'white' : 'gray'
                    }}
                  >
                    {wd}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm font-medium block mb-3">Упражнения ({newDayExercises.length})</label>
              <div className="space-y-2 mb-4">
                {newDayExercises.map((id, index) => {
                  const t = getTemplate(id);
                  if (!t) return null;
                  const cat = CATEGORY_INFO[t.category];
                  return (
                    <div key={id} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ backgroundColor: theme.bg.medium }}>
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: theme.bg.light }}>
                        {index + 1}
                      </span>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded"
                        style={{ backgroundColor: cat.bg, color: cat.color }}
                      >
                        {t.machineNumber}
                      </span>
                      <span className="flex-1 font-medium">{t.name}</span>
                      <button
                        onClick={() => setNewDayExercises(prev => prev.filter(eid => eid !== id))}
                        className="text-red-500 p-2"
                      >
                        {Icons.x}
                      </button>
                    </div>
                  );
                })}
              </div>

              <p className="text-gray-500 text-sm font-medium mb-2">Добавить:</p>
              <div className="space-y-2 max-h-72 overflow-auto">
                {data.templates
                  .filter(t => !newDayExercises.includes(t.id))
                  .map(t => {
                    const cat = CATEGORY_INFO[t.category];
                    return (
                      <button
                        key={t.id}
                        onClick={() => setNewDayExercises(prev => [...prev, t.id])}
                        className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left"
                        style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.light}` }}
                      >
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded"
                          style={{ backgroundColor: cat.bg, color: cat.color }}
                        >
                          {t.machineNumber}
                        </span>
                        <span className="font-medium">{t.name}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Catalog Screen
  const [catalogFilter, setCatalogFilter] = useState<ExerciseCategory | 'all'>('all');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<ExerciseTemplate | null>(null);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    machineNumber: '',
    name: '',
    description: '',
    category: 'machine' as ExerciseCategory,
  });

  const filteredTemplates = data.templates.filter(t => {
    if (catalogFilter !== 'all' && t.category !== catalogFilter) return false;
    if (catalogSearch && !t.name.toLowerCase().includes(catalogSearch.toLowerCase()) && !t.machineNumber.toLowerCase().includes(catalogSearch.toLowerCase())) return false;
    return true;
  });

  const handleSaveTemplate = () => {
    if (!newTemplate.name.trim()) return;
    
    if (editingTemplate) {
      setData(prev => updateTemplate(prev, editingTemplate.id, newTemplate));
    } else {
      setData(prev => createTemplate(prev, newTemplate));
    }
    
    setEditingTemplate(null);
    setShowNewTemplate(false);
    setNewTemplate({ machineNumber: '', name: '', description: '', category: 'machine' });
  };

  const renderCatalog = () => (
    <div className="min-h-screen text-white pb-28" style={{ backgroundColor: theme.bg.darkest }}>
      <header className="px-5 pt-4 pb-3">
        <h1 className="text-2xl font-bold">Каталог</h1>
        <p className="text-gray-400 mt-1">Все упражнения</p>
        
        <div className="mt-4 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">{Icons.search}</span>
          <input
            type="text"
            value={catalogSearch}
            onChange={(e) => setCatalogSearch(e.target.value)}
            placeholder="Поиск..."
            className="w-full rounded-xl pl-12 pr-4 py-3 outline-none"
            style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.light}` }}
          />
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 -mx-5 px-5">
          {[
            { id: 'all', label: 'Все' },
            { id: 'cardio', label: 'Кардио' },
            { id: 'machine', label: 'Тренажёры' },
            { id: 'free_weights', label: 'Свободные' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setCatalogFilter(f.id as ExerciseCategory | 'all')}
              className="px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all"
              style={{
                backgroundColor: catalogFilter === f.id ? theme.accent : theme.bg.medium,
                color: catalogFilter === f.id ? 'white' : 'gray'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 space-y-3">
        {filteredTemplates.map(t => {
          const cat = CATEGORY_INFO[t.category];
          const history = getExerciseHistory(data, t.id);
          const lastWorkout = history[0];
          const lastExercise = lastWorkout?.exercises.find(e => e.templateId === t.id);
          
          return (
            <div key={t.id} className="rounded-2xl p-4" style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ backgroundColor: cat.bg, color: cat.color }}
                    >
                      {t.machineNumber}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg">{t.name}</h3>
                  {t.description && (
                    <p className="text-gray-500 text-sm mt-1">{t.description}</p>
                  )}
                  {lastExercise && (
                    <p className="text-gray-400 text-sm mt-2">
                      Посл.: {lastExercise.sets.map(s => `${s.reps}×${s.weight}`).join(', ')} кг
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {history.length > 0 && (
                    <button
                      onClick={() => setShowHistory(t.id)}
                      className="text-gray-400 p-2"
                    >
                      {Icons.history}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingTemplate(t);
                      setNewTemplate({
                        machineNumber: t.machineNumber,
                        name: t.name,
                        description: t.description,
                        category: t.category,
                      });
                      setShowNewTemplate(true);
                    }}
                    className="p-2"
                    style={{ color: theme.accent }}
                  >
                    {Icons.edit}
                  </button>
                  <button
                    onClick={() => {
                      showConfirm({
                        title: 'Удалить упражнение?',
                        message: `"${t.name}" будет удалено.`,
                        confirmText: 'Удалить',
                        confirmColor: 'red',
                        onConfirm: () => {
                          hideConfirm();
                          setData(prev => deleteTemplate(prev, t.id));
                        },
                      });
                    }}
                    className="text-red-500 p-2"
                  >
                    {Icons.trash}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <button
          onClick={() => {
            setEditingTemplate(null);
            setNewTemplate({ machineNumber: '', name: '', description: '', category: 'machine' });
            setShowNewTemplate(true);
          }}
          className="w-full py-5 border-2 border-dashed rounded-2xl text-gray-400 font-semibold flex items-center justify-center gap-2"
          style={{ borderColor: theme.bg.light }}
        >
          {Icons.plus}
          Добавить упражнение
        </button>
      </div>

      {/* New/Edit Template Modal */}
      {showNewTemplate && (
        <div className="fixed inset-0 z-50 overflow-auto" style={{ backgroundColor: theme.bg.darkest }}>
          <header className="sticky top-0 px-5 pt-4 pb-3" style={{ backgroundColor: theme.bg.darkest, borderBottom: `1px solid ${theme.bg.medium}` }}>
            <div className="flex items-center justify-between">
              <button 
                onClick={() => {
                  setShowNewTemplate(false);
                  setEditingTemplate(null);
                }}
                className="text-red-500 font-semibold"
              >
                Отмена
              </button>
              <h1 className="font-bold">{editingTemplate ? 'Редактировать' : 'Новое упражнение'}</h1>
              <button onClick={handleSaveTemplate} className="font-semibold" style={{ color: theme.accent }}>
                Сохранить
              </button>
            </div>
          </header>

          <div className="px-5 py-6 space-y-6">
            <div>
              <label className="text-gray-400 text-sm font-medium block mb-2">Номер станка</label>
              <input
                type="text"
                value={newTemplate.machineNumber}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, machineNumber: e.target.value }))}
                placeholder="M01"
                className="w-full rounded-xl px-4 py-4 outline-none text-lg"
                style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.light}` }}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm font-medium block mb-2">Название</label>
              <input
                type="text"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Жим лёжа"
                className="w-full rounded-xl px-4 py-4 outline-none text-lg"
                style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.light}` }}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm font-medium block mb-2">Описание</label>
              <textarea
                value={newTemplate.description}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Грудные мышцы, трицепс"
                rows={3}
                className="w-full rounded-xl px-4 py-4 outline-none resize-none"
                style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.light}` }}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm font-medium block mb-3">Категория</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cardio', label: 'Кардио' },
                  { id: 'machine', label: 'Тренажёр' },
                  { id: 'free_weights', label: 'Св. веса' },
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => setNewTemplate(prev => ({ ...prev, category: c.id as ExerciseCategory }))}
                    className="py-4 rounded-xl font-bold transition-all"
                    style={{
                      backgroundColor: newTemplate.category === c.id ? theme.accent : theme.bg.medium,
                      color: newTemplate.category === c.id ? 'white' : 'gray'
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Weight Screen
  const [newBodyWeight, setNewBodyWeight] = useState('');
  const [selectedWeightPoint, setSelectedWeightPoint] = useState<{weight: number, date: string, x: number, y: number} | null>(null);
  
  const renderWeight = () => {
    const stats = getBodyWeightStats(data);
    const sortedWeights = [...data.bodyWeight].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const chartData = [...data.bodyWeight].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const handleAddWeight = () => {
      const weight = parseFloat(newBodyWeight);
      if (!isNaN(weight) && weight > 0) {
        setData(prev => addBodyWeight(prev, weight));
        setNewBodyWeight('');
      }
    };
    
    const minWeight = chartData.length > 0 ? Math.min(...chartData.map(d => d.weight)) - 2 : 0;
    const maxWeight = chartData.length > 0 ? Math.max(...chartData.map(d => d.weight)) + 2 : 100;
    const range = maxWeight - minWeight;
    
    const chartWidth = Math.max(300, chartData.length * 60);

    return (
      <div className="min-h-screen text-white pb-28" style={{ backgroundColor: theme.bg.darkest }}>
        <header className="px-5 pt-4 pb-4">
          <h1 className="text-2xl font-bold">Вес тела</h1>
          <p className="text-gray-400 mt-1">Отслеживание веса</p>
        </header>

        {/* Add weight form */}
        <div className="px-5 mb-6">
          <div className="rounded-3xl p-6 shadow-xl" style={{ background: `linear-gradient(135deg, ${theme.bg.dark} 0%, ${theme.bg.medium} 100%)`, border: `1px solid ${theme.bg.light}` }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm font-medium">Записать вес</span>
              <span className="text-gray-500 text-xs">{new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center rounded-2xl" style={{ backgroundColor: theme.bg.darkest, border: `1px solid ${theme.bg.light}` }}>
                <button
                  onClick={() => setNewBodyWeight(prev => {
                    const val = parseFloat(prev) || stats.current || 70;
                    return Math.max(30, val - 0.1).toFixed(1);
                  })}
                  className="w-16 h-16 flex items-center justify-center rounded-l-2xl flex-shrink-0 transition-colors active:opacity-60"
                  style={{ color: theme.accent }}
                >
                  {Icons.minus}
                </button>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={newBodyWeight}
                    onChange={(e) => setNewBodyWeight(e.target.value)}
                    placeholder={stats.current ? stats.current.toString() : '70.0'}
                    className="w-24 bg-transparent text-3xl font-bold outline-none"
                    style={{ textAlign: 'center' }}
                  />
                  <span className="text-gray-500 text-xs mt-1">кг</span>
                </div>
                <button
                  onClick={() => setNewBodyWeight(prev => {
                    const val = parseFloat(prev) || stats.current || 70;
                    return (val + 0.1).toFixed(1);
                  })}
                  className="w-16 h-16 flex items-center justify-center rounded-r-2xl flex-shrink-0 transition-colors active:opacity-60"
                  style={{ color: theme.accent }}
                >
                  {Icons.plus}
                </button>
              </div>
              <button
                onClick={handleAddWeight}
                className="text-white font-bold w-16 rounded-2xl flex items-center justify-center shadow-lg transition-all"
                style={{ background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentDark} 100%)` }}
              >
                {Icons.check}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards - Modern Design */}
        {stats.current > 0 && (
          <div className="px-5 mb-6">
            {/* Main Weight Card */}
            <div className="relative overflow-hidden rounded-3xl p-6 mb-4" style={{ background: `linear-gradient(145deg, ${theme.bg.dark} 0%, ${theme.bg.medium} 100%)`, border: `1px solid ${theme.bg.light}` }}>
              {/* Background decoration */}
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-10" style={{ background: theme.accent }}></div>
              <div className="absolute -right-4 -bottom-12 w-32 h-32 rounded-full opacity-5" style={{ background: theme.accent }}></div>
              
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Текущий вес</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-bold tracking-tight" style={{ color: theme.accentLight }}>{stats.current}</span>
                    <span className="text-2xl text-gray-400 font-medium">кг</span>
                  </div>
                  
                  {/* Trend indicator */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${
                      stats.trend === 'down' ? 'bg-green-500/20 text-green-400' :
                      stats.trend === 'up' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {stats.trend === 'down' ? Icons.trendDown : stats.trend === 'up' ? Icons.trendUp : Icons.stable}
                      <span>{stats.trend === 'down' ? 'Снижение' : stats.trend === 'up' ? 'Рост' : 'Стабильно'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `${theme.accent}20` }}>
                  <span style={{ color: theme.accent }}>{Icons.scale}</span>
                </div>
              </div>
            </div>
            
            {/* Change Stats Row */}
            <div className="flex gap-3">
              {/* All time change */}
              <div className="flex-1 rounded-2xl p-4 relative overflow-hidden" style={{ background: `linear-gradient(145deg, ${theme.bg.dark} 0%, ${theme.bg.medium} 100%)`, border: `1px solid ${theme.bg.light}` }}>
                <div className={`absolute top-0 left-0 w-1 h-full ${stats.change < 0 ? 'bg-green-500' : stats.change > 0 ? 'bg-red-500' : 'bg-gray-600'}`}></div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">За всё время</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${stats.change < 0 ? 'text-green-400' : stats.change > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {stats.change > 0 ? '+' : ''}{stats.change.toFixed(1)}
                  </span>
                  <span className="text-gray-500 text-sm">кг</span>
                </div>
              </div>
              
              {/* 7 days */}
              <div className="flex-1 rounded-2xl p-4 relative overflow-hidden" style={{ background: `linear-gradient(145deg, ${theme.bg.dark} 0%, ${theme.bg.medium} 100%)`, border: `1px solid ${theme.bg.light}` }}>
                <div className={`absolute top-0 left-0 w-1 h-full ${stats.week < 0 ? 'bg-green-500' : stats.week > 0 ? 'bg-red-500' : 'bg-gray-600'}`}></div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">7 дней</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${stats.week < 0 ? 'text-green-400' : stats.week > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {stats.week > 0 ? '+' : ''}{stats.week.toFixed(1)}
                  </span>
                  <span className="text-gray-500 text-sm">кг</span>
                </div>
              </div>
              
              {/* 30 days */}
              <div className="flex-1 rounded-2xl p-4 relative overflow-hidden" style={{ background: `linear-gradient(145deg, ${theme.bg.dark} 0%, ${theme.bg.medium} 100%)`, border: `1px solid ${theme.bg.light}` }}>
                <div className={`absolute top-0 left-0 w-1 h-full ${stats.month < 0 ? 'bg-green-500' : stats.month > 0 ? 'bg-red-500' : 'bg-gray-600'}`}></div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">30 дней</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${stats.month < 0 ? 'text-green-400' : stats.month > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {stats.month > 0 ? '+' : ''}{stats.month.toFixed(1)}
                  </span>
                  <span className="text-gray-500 text-sm">кг</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Chart */}
        {chartData.length > 1 && (
          <div className="px-5 mb-6">
            <div className="rounded-3xl p-5 shadow-xl" style={{ background: `linear-gradient(135deg, ${theme.bg.dark} 0%, ${theme.bg.medium} 100%)`, border: `1px solid ${theme.bg.light}` }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">График</h3>
                <span className="text-gray-500 text-xs">← прокрутите →</span>
              </div>
              
              {selectedWeightPoint && (
                <div 
                  className="absolute rounded-xl px-3 py-2 shadow-xl z-10 pointer-events-none transform -translate-x-1/2"
                  style={{ backgroundColor: theme.bg.medium, border: `1px solid ${theme.bg.lighter}`, left: `calc(${selectedWeightPoint.x}px + 3rem)` }}
                >
                  <p className="text-white font-bold text-lg">{selectedWeightPoint.weight} кг</p>
                  <p className="text-gray-400 text-xs">{new Date(selectedWeightPoint.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              )}
              
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between text-xs text-gray-500 z-10 pr-2" style={{ background: `linear-gradient(90deg, ${theme.bg.dark} 0%, transparent 100%)` }}>
                  <span>{maxWeight.toFixed(0)}</span>
                  <span>{((maxWeight + minWeight) / 2).toFixed(0)}</span>
                  <span>{minWeight.toFixed(0)}</span>
                </div>
                
                <div className="ml-10 overflow-x-auto pb-2">
                  <div className="relative h-52" style={{ width: `${chartWidth}px` }}>
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[0, 1, 2, 3, 4].map(i => (
                        <div key={i} style={{ borderTop: `1px solid ${theme.bg.light}30` }} />
                      ))}
                    </div>
                    
                    <svg 
                      className="absolute inset-0 w-full h-full" 
                      viewBox={`0 0 ${chartWidth} 200`}
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="weightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={theme.accent} stopOpacity="0.4" />
                          <stop offset="50%" stopColor={theme.accent} stopOpacity="0.1" />
                          <stop offset="100%" stopColor={theme.accent} stopOpacity="0" />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      
                      <polygon
                        fill="url(#weightGradient)"
                        points={`
                          0,200
                          ${chartData.map((d, i) => {
                            const x = 30 + (i / Math.max(1, chartData.length - 1)) * (chartWidth - 60);
                            const y = 10 + (1 - (d.weight - minWeight) / range) * 180;
                            return `${x},${y}`;
                          }).join(' ')}
                          ${chartWidth},200
                        `}
                      />
                      
                      <polyline
                        fill="none"
                        stroke={theme.accent}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow)"
                        points={chartData.map((d, i) => {
                          const x = 30 + (i / Math.max(1, chartData.length - 1)) * (chartWidth - 60);
                          const y = 10 + (1 - (d.weight - minWeight) / range) * 180;
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                      
                      {chartData.map((d, i) => {
                        const x = 30 + (i / Math.max(1, chartData.length - 1)) * (chartWidth - 60);
                        const y = 10 + (1 - (d.weight - minWeight) / range) * 180;
                        return (
                          <g key={d.id}>
                            <circle
                              cx={x}
                              cy={y}
                              r="12"
                              fill={theme.accent}
                              opacity="0.2"
                            />
                            <circle
                              cx={x}
                              cy={y}
                              r="6"
                              fill={theme.accent}
                              stroke={theme.bg.darkest}
                              strokeWidth="2"
                              className="cursor-pointer"
                              onClick={() => setSelectedWeightPoint(
                                selectedWeightPoint?.date === d.date 
                                  ? null 
                                  : { weight: d.weight, date: d.date, x, y }
                              )}
                            />
                            <text
                              x={x}
                              y={y - 15}
                              textAnchor="middle"
                              fill="#fff"
                              fontSize="11"
                              fontWeight="bold"
                              className="pointer-events-none"
                            >
                              {d.weight}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                    
                    <div className="absolute bottom-0 left-0 right-0 flex" style={{ height: '20px' }}>
                      {chartData.map((d, i) => {
                        const x = 30 + (i / Math.max(1, chartData.length - 1)) * (chartWidth - 60);
                        const showLabel = i === 0 || i === chartData.length - 1 || i % Math.ceil(chartData.length / 6) === 0;
                        if (!showLabel) return null;
                        return (
                          <span
                            key={d.id}
                            className="absolute text-xs text-gray-500 transform -translate-x-1/2"
                            style={{ left: `${x}px` }}
                          >
                            {new Date(d.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weight List */}
        <div className="px-5">
          <h3 className="text-lg font-bold mb-4">История</h3>
          {sortedWeights.length > 0 ? (
            <div className="space-y-2">
              {sortedWeights.map((entry, index) => {
                const prevEntry = sortedWeights[index + 1];
                const diff = prevEntry ? entry.weight - prevEntry.weight : 0;
                const isToday = new Date(entry.date).toDateString() === new Date().toDateString();
                
                return (
                  <div 
                    key={entry.id} 
                    className="rounded-2xl p-4 flex items-center justify-between transition-all"
                    style={{
                      backgroundColor: isToday ? `${theme.accent}15` : theme.bg.dark,
                      border: `1px solid ${isToday ? theme.accent + '50' : theme.bg.medium}`
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: diff < 0 ? 'rgba(16, 185, 129, 0.2)' : diff > 0 ? 'rgba(239, 68, 68, 0.2)' : theme.bg.medium }}
                      >
                        {diff < 0 ? (
                          <span className="text-green-400">{Icons.trendDown}</span>
                        ) : diff > 0 ? (
                          <span className="text-red-400">{Icons.trendUp}</span>
                        ) : (
                          <span className="text-gray-500">{Icons.stable}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: isToday ? theme.accent : 'white' }}>
                          {isToday ? 'Сегодня' : new Date(entry.date).toLocaleDateString('ru-RU', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </p>
                        {diff !== 0 && (
                          <p className={`text-xs font-medium ${diff < 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {diff > 0 ? '+' : ''}{diff.toFixed(1)} кг
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold">{entry.weight}</span>
                      <span className="text-gray-500">кг</span>
                      <button
                        onClick={() => {
                          showConfirm({
                            title: 'Удалить запись?',
                            message: `${entry.weight} кг будет удалено.`,
                            confirmText: 'Удалить',
                            confirmColor: 'red',
                            onConfirm: () => {
                              hideConfirm();
                              setData(prev => deleteBodyWeight(prev, entry.id));
                            },
                          });
                        }}
                        className="text-gray-600 active:text-red-500 p-2 -mr-2"
                      >
                        {Icons.trash}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl p-8 text-center" style={{ background: `linear-gradient(135deg, ${theme.bg.dark} 0%, ${theme.bg.medium} 100%)`, border: `1px solid ${theme.bg.light}` }}>
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: theme.bg.light }}>
                {Icons.scale}
              </div>
              <p className="text-gray-300 font-semibold text-lg">Нет записей</p>
              <p className="text-gray-500 text-sm mt-1">Добавьте первый вес выше</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Running Screen
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [finishRunDistance, setFinishRunDistance] = useState('');
  const [showFinishRunModal, setShowFinishRunModal] = useState(false);
  
  const activeRun = data.runSessions.find(r => r.id === activeRunId);
  const activeOrUnfinishedRun = activeRun || data.runSessions.find(r => !r.completed);
  
  // Calculate current run time
  const getCurrentRunTime = (run: typeof activeRun) => {
    if (!run) return 0;
    let time = run.totalTime;
    if (run.timerStatus === 'running' && run.startedAt) {
      const now = new Date();
      const start = new Date(run.startedAt);
      time += Math.floor((now.getTime() - start.getTime()) / 1000);
    }
    return time;
  };
  
  const handleStartRun = () => {
    const newData = startRunSession(data);
    setData(newData);
    const newRun = newData.runSessions[newData.runSessions.length - 1];
    setActiveRunId(newRun.id);
    setScreen('activeRun');
  };
  
  const handlePauseRun = () => {
    if (!activeRunId) return;
    setData(prev => pauseRunSession(prev, activeRunId));
  };
  
  const handleResumeRun = () => {
    if (!activeRunId) return;
    setData(prev => resumeRunSession(prev, activeRunId));
  };
  
  const handleFinishRun = () => {
    if (!activeRunId) return;
    const distance = parseFloat(finishRunDistance) || 0;
    setData(prev => completeRunSession(prev, activeRunId, distance));
    setActiveRunId(null);
    setFinishRunDistance('');
    setShowFinishRunModal(false);
    setScreen('running');
  };
  
  const handleDeleteRun = (runId: string) => {
    showConfirm({
      title: 'Удалить пробежку?',
      message: 'Эта пробежка будет удалена из истории.',
      confirmText: 'Удалить',
      confirmColor: 'red',
      onConfirm: () => {
        hideConfirm();
        setData(prev => deleteRunSession(prev, runId));
        if (activeRunId === runId) {
          setActiveRunId(null);
          setScreen('running');
        }
      },
    });
  };

  const renderActiveRun = () => {
    const run = activeOrUnfinishedRun;
    if (!run) {
      if (screen === 'activeRun') {
        setTimeout(() => setScreen('running'), 0);
      }
      return null;
    }
    
    const currentTime = getCurrentRunTime(run);
    const isRunning = run.timerStatus === 'running';
    const isPaused = run.timerStatus === 'paused';
    
    return (
      <div className="fixed inset-0 text-white z-50 flex flex-col" style={{ backgroundColor: theme.bg.darkest }}>
        {/* Header */}
        <header className="px-5 pt-12 pb-4 flex-shrink-0" style={{ borderBottom: `1px solid ${theme.bg.medium}` }}>
          <div className="flex items-center justify-between">
            <button 
              onClick={() => {
                if (run.timerStatus === 'idle') {
                  setData(prev => deleteRunSession(prev, run.id));
                }
                setActiveRunId(null);
                setScreen('running');
              }}
              className="font-semibold flex items-center"
              style={{ color: theme.accent }}
            >
              {Icons.chevronLeft} Назад
            </button>
            <h1 className="text-lg font-bold">Пробежка</h1>
            <div className="w-16" />
          </div>
        </header>
        
        {/* Timer Display */}
        <div className="flex-1 flex flex-col items-center justify-center px-5">
          <div className="relative">
            <div 
              className="w-64 h-64 rounded-full flex flex-col items-center justify-center"
              style={{ 
                background: isRunning 
                  ? `conic-gradient(${theme.accent} ${(currentTime % 60) / 60 * 360}deg, ${theme.bg.dark} 0deg)`
                  : theme.bg.dark,
                boxShadow: isRunning ? `0 0 60px ${theme.accent}40` : 'none'
              }}
            >
              <div 
                className="w-56 h-56 rounded-full flex flex-col items-center justify-center"
                style={{ backgroundColor: theme.bg.darkest }}
              >
                <p className="text-5xl font-bold font-mono tracking-tight">
                  {formatTimeHMS(currentTime)}
                </p>
                <p className="text-gray-500 mt-2">
                  {isRunning ? 'В процессе' : isPaused ? 'Пауза' : 'Готов к старту'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Run Type selector - Full width */}
          <div className="mt-8 w-full max-w-md px-4">
            <div className="rounded-2xl p-5" style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}>
              <p className="text-gray-400 text-sm font-medium mb-4 text-center uppercase tracking-wide">Тип активности</p>
              <div className="flex gap-3">
                {Object.entries(RUN_TYPES).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setData(prev => updateRunSession(prev, run.id, { runType: key as any }))}
                    className="flex-1 py-5 rounded-2xl font-bold text-lg transition-all flex flex-col items-center gap-2"
                    style={{
                      backgroundColor: run.runType === key ? theme.accent : theme.bg.medium,
                      color: run.runType === key ? 'white' : 'gray',
                      border: run.runType === key ? `2px solid ${theme.accentLight}` : `2px solid transparent`
                    }}
                  >
                    <span className="text-4xl">{val.emoji}</span>
                    <span className="text-base">{val.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Control Buttons */}
        <div className="p-5 flex-shrink-0" style={{ borderTop: `1px solid ${theme.bg.medium}` }}>
          <div className="flex gap-3">
            {run.timerStatus === 'idle' && (
              <button
                onClick={() => {
                  setActiveRunId(run.id);
                  setData(prev => resumeRunSession(prev, run.id));
                }}
                className="flex-1 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentDark} 100%)` }}
              >
                {Icons.play} Начать
              </button>
            )}
            
            {isRunning && (
              <>
                <button
                  onClick={handlePauseRun}
                  className="flex-1 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 bg-yellow-600"
                >
                  {Icons.pause} Пауза
                </button>
                <button
                  onClick={() => {
                    handlePauseRun();
                    setShowFinishRunModal(true);
                  }}
                  className="py-5 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 bg-green-600"
                >
                  {Icons.flag}
                </button>
              </>
            )}
            
            {isPaused && (
              <>
                <button
                  onClick={handleResumeRun}
                  className="flex-1 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentDark} 100%)` }}
                >
                  {Icons.play} Продолжить
                </button>
                <button
                  onClick={() => setShowFinishRunModal(true)}
                  className="py-5 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 bg-green-600"
                >
                  {Icons.flag} Финиш
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Finish Run Modal */}
        {showFinishRunModal && (
          <div className="fixed inset-0 bg-black/80 z-[60] flex items-end justify-center">
            <div 
              className="w-full max-w-lg rounded-t-3xl p-6 animate-slide-up"
              style={{ backgroundColor: theme.bg.dark }}
            >
              <h3 className="text-xl font-bold text-center mb-6">Завершить пробежку</h3>
              
              <div className="mb-6">
                <label className="text-gray-400 text-sm font-medium block mb-2 text-center">Дистанция (км)</label>
                <div className="flex items-center rounded-2xl" style={{ backgroundColor: theme.bg.medium }}>
                  <button
                    onClick={() => setFinishRunDistance(prev => {
                      const val = parseFloat(prev) || 0;
                      return Math.max(0, val - 0.1).toFixed(1);
                    })}
                    className="w-16 h-16 flex items-center justify-center rounded-l-2xl"
                    style={{ color: theme.accent }}
                  >
                    {Icons.minus}
                  </button>
                  <div className="flex-1 flex justify-center">
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      value={finishRunDistance}
                      onChange={(e) => setFinishRunDistance(e.target.value)}
                      placeholder="0.0"
                      className="w-24 bg-transparent text-3xl font-bold outline-none"
                      style={{ textAlign: 'center' }}
                    />
                  </div>
                  <button
                    onClick={() => setFinishRunDistance(prev => {
                      const val = parseFloat(prev) || 0;
                      return (val + 0.1).toFixed(1);
                    })}
                    className="w-16 h-16 flex items-center justify-center rounded-r-2xl"
                    style={{ color: theme.accent }}
                  >
                    {Icons.plus}
                  </button>
                </div>
              </div>
              
              {/* Effort */}
              <div className="mb-6">
                <label className="text-gray-400 text-sm font-medium block mb-2 text-center">
                  Уровень усилия: {run.effort}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={run.effort}
                  onChange={(e) => setData(prev => updateRunSession(prev, run.id, { effort: parseInt(e.target.value) }))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(90deg, ${theme.accent} ${run.effort * 10}%, ${theme.bg.medium} ${run.effort * 10}%)` }}
                />
              </div>
              
              {/* Feeling */}
              <div className="mb-6">
                <label className="text-gray-400 text-sm font-medium block mb-2 text-center">Самочувствие</label>
                <div className="flex justify-center gap-2">
                  {Object.entries(RUN_FEELINGS).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setData(prev => updateRunSession(prev, run.id, { feeling: key as any }))}
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all"
                      style={{
                        backgroundColor: run.feeling === key ? val.color : theme.bg.medium,
                        transform: run.feeling === key ? 'scale(1.1)' : 'scale(1)'
                      }}
                    >
                      {val.emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Weather */}
              <div className="mb-6">
                <label className="text-gray-400 text-sm font-medium block mb-2 text-center">Погода</label>
                <div className="flex justify-center gap-2 flex-wrap">
                  {Object.entries(RUN_WEATHER).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setData(prev => updateRunSession(prev, run.id, { weather: key as any }))}
                      className="px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1"
                      style={{
                        backgroundColor: run.weather === key ? theme.accent : theme.bg.medium,
                        color: run.weather === key ? 'white' : 'gray'
                      }}
                    >
                      {val.emoji} {val.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFinishRunModal(false)}
                  className="flex-1 py-4 rounded-xl font-bold"
                  style={{ backgroundColor: theme.bg.medium }}
                >
                  Отмена
                </button>
                <button
                  onClick={handleFinishRun}
                  className="flex-1 py-4 rounded-xl font-bold bg-green-600"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRunning = () => {
    const stats = getRunStats(data);
    const completedRuns = data.runSessions
      .filter(r => r.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Check for unfinished run
    const unfinishedRun = data.runSessions.find(r => !r.completed);
    
    return (
      <div className="min-h-screen text-white pb-28" style={{ backgroundColor: theme.bg.darkest }}>
        <header className="px-5 pt-4 pb-4">
          <h1 className="text-2xl font-bold">Бег</h1>
          <p className="text-gray-400 mt-1">Отслеживание пробежек</p>
        </header>
        
        {/* Continue unfinished run */}
        {unfinishedRun && (
          <div className="px-5 mb-6">
            <button
              onClick={() => {
                setActiveRunId(unfinishedRun.id);
                setScreen('activeRun');
              }}
              className="w-full rounded-2xl p-5 text-left shadow-lg"
              style={{ background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentDark} 100%)` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-200 text-sm font-medium uppercase tracking-wide">Продолжить</p>
                  <p className="text-white text-2xl font-bold font-mono mt-1">
                    {formatTimeHMS(getCurrentRunTime(unfinishedRun))}
                  </p>
                  <p className="text-indigo-200 text-sm">{RUN_TYPES[unfinishedRun.runType]?.label}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  {Icons.play}
                </div>
              </div>
            </button>
          </div>
        )}
        
        {/* Start New Run */}
        {!unfinishedRun && (
          <div className="px-5 mb-6">
            <button
              onClick={handleStartRun}
              className="w-full rounded-2xl p-6 active:scale-[0.98] transition-transform"
              style={{ background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentDark} 100%)` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  {Icons.running}
                </div>
                <div className="text-left">
                  <p className="font-bold text-xl">Начать пробежку</p>
                  <p className="text-indigo-200 text-sm">Запустить таймер</p>
                </div>
              </div>
            </button>
          </div>
        )}
        
        {/* Stats */}
        {stats.totalRuns > 0 && (
          <div className="px-5 mb-6">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="rounded-2xl p-4 text-center" style={{ background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentDark} 100%)` }}>
                <p className="text-indigo-200 text-xs font-medium">Всего</p>
                <p className="text-2xl font-bold mt-1">{stats.totalDistance}</p>
                <p className="text-indigo-200 text-xs">км</p>
              </div>
              <div className="rounded-2xl p-4 text-center bg-gradient-to-br from-green-600 to-green-700">
                <p className="text-green-200 text-xs font-medium">За неделю</p>
                <p className="text-2xl font-bold mt-1">{stats.weekDistance}</p>
                <p className="text-green-200 text-xs">км</p>
              </div>
              <div className="rounded-2xl p-4 text-center bg-gradient-to-br from-orange-600 to-orange-700">
                <p className="text-orange-200 text-xs font-medium">Лучший темп</p>
                <p className="text-2xl font-bold mt-1">{formatPace(stats.bestPace)}</p>
                <p className="text-orange-200 text-xs">мин/км</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-4" style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}>
                <p className="text-gray-500 text-xs font-medium">Пробежек</p>
                <p className="text-xl font-bold mt-1">{stats.totalRuns}</p>
              </div>
              <div className="rounded-2xl p-4" style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}>
                <p className="text-gray-500 text-xs font-medium">Ср. дистанция</p>
                <p className="text-xl font-bold mt-1">{stats.avgDistance} км</p>
              </div>
            </div>
          </div>
        )}
        
        {/* History */}
        <section className="px-5">
          <h2 className="text-lg font-bold mb-4">История</h2>
          {completedRuns.length > 0 ? (
            <div className="space-y-3">
              {completedRuns.map(run => {
                const runType = RUN_TYPES[run.runType];
                // surface removed
                const feeling = run.feeling ? RUN_FEELINGS[run.feeling] : null;
                const weather = run.weather ? RUN_WEATHER[run.weather] : null;
                
                return (
                  <div 
                    key={run.id}
                    className="rounded-2xl p-4"
                    style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-gray-400 text-sm">
                          {new Date(run.date).toLocaleDateString('ru-RU', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-lg font-bold">{run.distance} км</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-400">{formatTimeHMS(run.totalTime)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {feeling && <span className="text-xl">{feeling.emoji}</span>}
                        <button
                          onClick={() => handleDeleteRun(run.id)}
                          className="text-gray-600 p-2"
                        >
                          {Icons.trash}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <span 
                        className="px-2 py-1 rounded-lg text-xs font-medium"
                        style={{ backgroundColor: theme.bg.medium }}
                      >
                        {runType?.emoji} {runType?.label}
                      </span>
                      { /* surface removed */ }
                      {weather && (
                        <span 
                          className="px-2 py-1 rounded-lg text-xs font-medium"
                          style={{ backgroundColor: theme.bg.medium }}
                        >
                          {weather.emoji}
                        </span>
                      )}
                      <span 
                        className="px-2 py-1 rounded-lg text-xs font-medium"
                        style={{ backgroundColor: theme.bg.medium }}
                      >
                        {formatPace(run.pace || 0)} мин/км
                      </span>
                      <span 
                        className="px-2 py-1 rounded-lg text-xs font-medium"
                        style={{ backgroundColor: theme.bg.medium }}
                      >
                        Усилие: {run.effort}/10
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: theme.bg.medium }}>
                {Icons.running}
              </div>
              <p className="text-gray-400 font-medium">Нет пробежек</p>
              <p className="text-gray-500 text-sm mt-1">Начните первую пробежку</p>
            </div>
          )}
        </section>
      </div>
    );
  };

  // Settings Screen
  const renderSettings = () => {
    const profile = data.userProfile;
    const currentWeight = getCurrentWeight(data);
    
    return (
      <div className="min-h-screen text-white pb-28" style={{ backgroundColor: theme.bg.darkest }}>
        <header className="px-5 pt-4 pb-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setScreen('home')}
              className="font-semibold flex items-center"
              style={{ color: theme.accent }}
            >
              {Icons.chevronLeft}
            </button>
            <h1 className="text-2xl font-bold">Настройки</h1>
          </div>
        </header>

        <div className="px-5 space-y-6">
          {/* Profile Section */}
          <div className="rounded-2xl p-5" style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.accent }}>
                {Icons.user}
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-sm">Профиль</p>
                <p className="font-bold text-lg">{profile.name || 'Не указано'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm font-medium block mb-2">Имя</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setData(prev => updateUserProfile(prev, { name: e.target.value }))}
                  placeholder="Ваше имя"
                  className="w-full rounded-xl px-4 py-3 outline-none"
                  style={{ backgroundColor: theme.bg.medium, border: `1px solid ${theme.bg.light}` }}
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm font-medium block mb-2">Пол</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'male', label: 'Мужской' },
                    { id: 'female', label: 'Женский' },
                  ].map(g => (
                    <button
                      key={g.id}
                      onClick={() => setData(prev => updateUserProfile(prev, { gender: g.id as any }))}
                      className="py-3 rounded-xl font-semibold transition-all"
                      style={{
                        backgroundColor: profile.gender === g.id ? theme.accent : theme.bg.medium,
                        color: profile.gender === g.id ? 'white' : 'gray'
                      }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm font-medium block mb-2">Дата рождения</label>
                <input
                  type="date"
                  value={profile.birthDate}
                  onChange={(e) => setData(prev => updateUserProfile(prev, { birthDate: e.target.value }))}
                  className="w-full rounded-xl px-4 py-3 outline-none"
                  style={{ backgroundColor: theme.bg.medium, border: `1px solid ${theme.bg.light}` }}
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm font-medium block mb-2">Рост (см)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={profile.height || ''}
                  onChange={(e) => setData(prev => updateUserProfile(prev, { height: parseInt(e.target.value) || 0 }))}
                  placeholder="170"
                  className="w-full rounded-xl px-4 py-3 outline-none"
                  style={{ backgroundColor: theme.bg.medium, border: `1px solid ${theme.bg.light}` }}
                />
              </div>
            </div>
          </div>

          {/* Current Stats */}
          {currentWeight > 0 && (
            <div className="rounded-2xl p-5" style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}>
              <h3 className="font-bold mb-4">Текущие показатели</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-4 text-center" style={{ backgroundColor: theme.bg.medium }}>
                  <p className="text-gray-500 text-xs">Вес</p>
                  <p className="text-2xl font-bold" style={{ color: theme.accentLight }}>{currentWeight} кг</p>
                </div>
                <div className="rounded-xl p-4 text-center" style={{ backgroundColor: theme.bg.medium }}>
                  <p className="text-gray-500 text-xs">Рост</p>
                  <p className="text-2xl font-bold" style={{ color: theme.accentLight }}>{profile.height || '—'} см</p>
                </div>
              </div>
              
              {profile.height > 0 && currentWeight > 0 && (
                <div className="mt-3 rounded-xl p-4 text-center" style={{ backgroundColor: theme.bg.medium }}>
                  <p className="text-gray-500 text-xs">ИМТ (Индекс массы тела)</p>
                  <p className="text-2xl font-bold" style={{ color: theme.accentLight }}>
                    {(currentWeight / ((profile.height / 100) ** 2)).toFixed(1)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* About */}
          <div className="rounded-2xl p-5" style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}>
            <h3 className="font-bold mb-2">О приложении</h3>
            <p className="text-gray-500 text-sm">GymTracker v1.0</p>
            <p className="text-gray-500 text-sm">Ваш личный дневник тренировок</p>
          </div>
        </div>
      </div>
    );
  };

  // Finish Workout Screen
  const renderFinishWorkout = () => {
    if (!activeWorkout) return null;
    
    // Calculate workout stats
    const totalTime = activeWorkout.exercises.reduce((sum, e) => sum + (e.totalTime || 0), 0);
    const completedExercises = activeWorkout.exercises.filter(e => e.completed).length;
    const totalSets = activeWorkout.exercises.reduce((sum, e) => sum + e.sets.filter(s => s.completed).length, 0);
    const currentWeight = getCurrentWeight(data);
    const estimatedCalories = currentWeight > 0 ? calculateWorkoutCalories(finishIntensity, currentWeight, totalTime) : 0;
    
    return (
      <div className="fixed inset-0 text-white z-50 overflow-auto" style={{ backgroundColor: theme.bg.darkest }}>
        <header className="sticky top-0 px-5 pt-4 pb-3 z-10" style={{ backgroundColor: theme.bg.darkest, borderBottom: `1px solid ${theme.bg.medium}` }}>
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setScreen('workout')}
              className="font-semibold flex items-center"
              style={{ color: theme.accent }}
            >
              {Icons.chevronLeft} Назад
            </button>
            <h1 className="text-lg font-bold">Завершить тренировку</h1>
            <div className="w-16" />
          </div>
        </header>

        <div className="px-5 py-4">
          {/* Summary */}
          <div className="rounded-2xl p-5 mb-4" style={{ background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentDark} 100%)` }}>
            <h3 className="text-indigo-200 text-sm font-medium mb-2">Отличная работа!</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{completedExercises}</p>
                <p className="text-indigo-200 text-xs">упражнений</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{totalSets}</p>
                <p className="text-indigo-200 text-xs">подходов</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{formatTime(totalTime)}</p>
                <p className="text-indigo-200 text-xs">время</p>
              </div>
            </div>
          </div>

          {/* Estimated Calories */}
          {estimatedCalories > 0 && (
            <div className="rounded-2xl p-4 mb-4 flex items-center gap-4" style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-500/20 text-orange-500">
                {Icons.fire}
              </div>
              <div>
                <p className="text-gray-400 text-sm">Примерно сожжено</p>
                <p className="text-xl font-bold text-orange-500">{estimatedCalories} ккал</p>
              </div>
            </div>
          )}

          {/* Intensity */}
          <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}>
            <label className="text-gray-400 text-sm font-medium block mb-3">Интенсивность тренировки</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(WORKOUT_INTENSITIES).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setFinishIntensity(key as WorkoutIntensity)}
                  className="py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: finishIntensity === key ? val.color : theme.bg.medium,
                    color: finishIntensity === key ? 'white' : 'gray'
                  }}
                >
                  <span className="text-lg">{val.emoji}</span>
                  <span className="text-sm">{val.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feeling */}
          <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}>
            <label className="text-gray-400 text-sm font-medium block mb-3">Как вы себя чувствуете?</label>
            <div className="flex justify-between gap-2">
              {Object.entries(WORKOUT_FEELINGS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setFinishFeeling(key)}
                  className="flex-1 py-2 rounded-xl flex flex-col items-center gap-1 transition-all"
                  style={{
                    backgroundColor: finishFeeling === key ? val.color : theme.bg.medium,
                    transform: finishFeeling === key ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <span className="text-xl">{val.emoji}</span>
                  <span className="text-[10px] font-medium text-white">{val.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Button */}
          <button
            onClick={handleConfirmFinishWorkout}
            className="w-full py-5 rounded-2xl font-bold text-xl bg-green-600 active:bg-green-500 flex items-center justify-center gap-3 shadow-lg mb-8"
          >
            {Icons.check} Завершить тренировку
          </button>
        </div>
      </div>
    );
  };

  // Stats Screen
  const renderStats = () => {
    const completedWorkouts = data.workouts.filter(w => w.completed);
    const totalSets = completedWorkouts.reduce(
      (sum, w) => sum + w.exercises.reduce((esum, e) => esum + e.sets.filter(s => s.completed).length, 0),
      0
    );
    const totalVolume = completedWorkouts.reduce(
      (sum, w) => sum + w.exercises.reduce(
        (esum, e) => esum + e.sets.reduce((ssum, s) => ssum + (s.completed ? s.reps * s.weight : 0), 0),
        0
      ),
      0
    );

    const records: { templateId: string; maxWeight: number; template: ExerciseTemplate }[] = [];
    data.templates.forEach(t => {
      let maxWeight = 0;
      completedWorkouts.forEach(w => {
        w.exercises.forEach(e => {
          if (e.templateId === t.id) {
            e.sets.forEach(s => {
              if (s.completed && s.weight > maxWeight) {
                maxWeight = s.weight;
              }
            });
          }
        });
      });
      if (maxWeight > 0) {
        records.push({ templateId: t.id, maxWeight, template: t });
      }
    });
    records.sort((a, b) => b.maxWeight - a.maxWeight);

    return (
      <div className="min-h-screen text-white pb-28" style={{ backgroundColor: theme.bg.darkest }}>
        <header className="px-5 pt-4 pb-4">
          <h1 className="text-2xl font-bold">Прогресс</h1>
          <p className="text-gray-400 mt-1">Ваша статистика</p>
        </header>

        {/* Stats Cards */}
        <div className="px-5 grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-2xl p-4 text-center" style={{ background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentDark} 100%)` }}>
            <p className="text-teal-200 text-xs font-medium">Тренировок</p>
            <p className="text-2xl font-bold mt-1">{completedWorkouts.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-4 text-center">
            <p className="text-green-200 text-xs font-medium">Подходов</p>
            <p className="text-2xl font-bold mt-1">{totalSets}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-4 text-center">
            <p className="text-orange-200 text-xs font-medium">Объём</p>
            <p className="text-2xl font-bold mt-1">{(totalVolume / 1000).toFixed(1)}k</p>
          </div>
        </div>

        {/* Records */}
        <section className="px-5">
          <h2 className="text-lg font-bold mb-4">Личные рекорды</h2>
          {records.length > 0 ? (
            <div className="space-y-2">
              {records.slice(0, 10).map((r, i) => {
                const cat = CATEGORY_INFO[r.template.category];
                return (
                  <button
                    key={r.templateId}
                    onClick={() => setShowHistory(r.templateId)}
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-4 active:scale-[0.98] transition-transform"
                    style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}
                  >
                    <span className="w-10 text-2xl text-center">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </span>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded"
                          style={{ backgroundColor: cat.bg, color: cat.color }}
                        >
                          {r.template.machineNumber}
                        </span>
                        <span className="font-semibold">{r.template.name}</span>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-orange-500">{r.maxWeight} кг</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: theme.bg.dark, border: `1px solid ${theme.bg.medium}` }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: theme.bg.medium }}>
                {Icons.chart}
              </div>
              <p className="text-gray-400 font-medium">Нет рекордов</p>
              <p className="text-gray-500 text-sm mt-1">Начните тренироваться</p>
            </div>
          )}
        </section>
      </div>
    );
  };

  return (
    <div className="font-sans antialiased">
      {screen === 'home' && renderHome()}
      {screen === 'workout' && renderWorkout()}
      {screen === 'exercise' && renderExercise()}
      {screen === 'addExercise' && renderAddExercise()}
      {screen === 'editWorkout' && renderEditWorkout()}
      {screen === 'programs' && renderPrograms()}
      {screen === 'catalog' && renderCatalog()}
      {screen === 'weight' && renderWeight()}
      {screen === 'running' && renderRunning()}
      {screen === 'activeRun' && renderActiveRun()}
      {screen === 'settings' && renderSettings()}
      {screen === 'finishWorkout' && renderFinishWorkout()}
      {screen === 'stats' && renderStats()}
      
      {renderHistory()}
      
      {screen !== 'exercise' && screen !== 'workout' && screen !== 'addExercise' && screen !== 'editWorkout' && screen !== 'activeRun' && renderNav()}
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        confirmColor={confirmModal.confirmColor}
        onConfirm={confirmModal.onConfirm}
        onCancel={hideConfirm}
      />
    </div>
  );
}
