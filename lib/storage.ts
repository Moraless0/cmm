// Utilidades para localStorage

const STORAGE_KEYS = {
  JOURNAL: 'financial_journal',
  GOALS: 'financial_goals',
  USER_PROGRESS: 'user_progress',
  THEME: 'theme_preference',
  SIMULACIONES: 'simulaciones_guardadas'
};

export const storage = {
  // Bitácora emocional
  getJournal: (): any[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    return data ? JSON.parse(data) : [];
  },
  
  saveJournalEntry: (entry: any): void => {
    if (typeof window === 'undefined') return;
    const journal = storage.getJournal();
    journal.push(entry);
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(journal));
  },
  
  deleteJournalEntry: (id: string): void => {
    if (typeof window === 'undefined') return;
    const journal = storage.getJournal();
    const filtered = journal.filter((entry: any) => entry.id !== id);
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(filtered));
  },
  
  // Metas financieras
  getGoals: (): any[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    return data ? JSON.parse(data) : [];
  },
  
  saveGoal: (goal: any): void => {
    if (typeof window === 'undefined') return;
    const goals = storage.getGoals();
    const existingIndex = goals.findIndex((g: any) => g.id === goal.id);
    
    if (existingIndex >= 0) {
      goals[existingIndex] = goal;
    } else {
      goals.push(goal);
    }
    
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  },
  
  deleteGoal: (id: string): void => {
    if (typeof window === 'undefined') return;
    const goals = storage.getGoals();
    const filtered = goals.filter((g: any) => g.id !== id);
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(filtered));
  },
  
  // Progreso del usuario
  getUserProgress: (): any => {
    if (typeof window === 'undefined') return { puntos: 0, nivel: 'Novato', logros: [] };
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    return data ? JSON.parse(data) : { puntos: 0, nivel: 'Novato', logros: [] };
  },
  
  saveUserProgress: (progress: any): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
  },
  
  addPoints: (points: number): void => {
    const progress = storage.getUserProgress();
    progress.puntos += points;
    
    // Actualizar nivel basado en puntos
    if (progress.puntos >= 500) progress.nivel = 'Experto';
    else if (progress.puntos >= 300) progress.nivel = 'Avanzado';
    else if (progress.puntos >= 100) progress.nivel = 'Intermedio';
    else progress.nivel = 'Novato';
    
    storage.saveUserProgress(progress);
  },
  
  addAchievement: (achievementId: string): void => {
    const progress = storage.getUserProgress();
    if (!progress.logros.includes(achievementId)) {
      progress.logros.push(achievementId);
      storage.saveUserProgress(progress);
    }
  },
  
  // Tema
  getTheme: (): string => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  },
  
  setTheme: (theme: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },
  
  // Simulaciones
  getSimulaciones: (): any[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.SIMULACIONES);
    return data ? JSON.parse(data) : [];
  },
  
  saveSimulacion: (simulacion: any): void => {
    if (typeof window === 'undefined') return;
    const simulaciones = storage.getSimulaciones();
    simulaciones.push(simulacion);
    localStorage.setItem(STORAGE_KEYS.SIMULACIONES, JSON.stringify(simulaciones));
  }
};
