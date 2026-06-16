// Tipos globales para la aplicación financiera

export interface JournalEntry {
  id: string;
  fecha: Date;
  titulo: string;
  contenido: string;
  categoria: 'ahorro' | 'gasto' | 'emocion';
  sentimiento: string;
}

export interface FinancialGoal {
  id: string;
  nombre: string;
  montoObjetivo: number;
  montoActual: number;
  fechaLimite: Date;
  categoria: string;
  completada: boolean;
}

export interface UserProgress {
  puntos: number;
  nivel: string;
  logros: string[];
}

export interface SimulacionParams {
  montoInicial: number;
  aportacionMensual: number;
  tasaInteresAnual: number;
  periodoMeses: number;
}

export interface ResultadoMes {
  mes: number;
  monto: number;
  interes: number;
}

export interface ResultadoSimulacion {
  montoFinal: number;
  resultados: ResultadoMes[];
}

export interface Achievement {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  puntos: number;
  desbloqueado: boolean;
}
