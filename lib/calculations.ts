// Cálculos financieros

import { SimulacionParams, ResultadoSimulacion, ResultadoMes } from '@/types';

export function calcularInteresCompuesto(
  montoInicial: number,
  aportacionMensual: number,
  tasaInteresAnual: number,
  periodoMeses: number
): ResultadoSimulacion {
  const tasaMensual = tasaInteresAnual / 100 / 12;
  let montoTotal = montoInicial;
  const resultados: ResultadoMes[] = [];
  
  for (let mes = 1; mes <= periodoMeses; mes++) {
    montoTotal = (montoTotal + aportacionMensual) * (1 + tasaMensual);
    const totalInvertido = montoInicial + aportacionMensual * mes;
    resultados.push({
      mes,
      monto: montoTotal,
      interes: montoTotal - totalInvertido
    });
  }
  
  return { montoFinal: montoTotal, resultados };
}

export function formatearMoneda(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
}

export function calcularProgresoMeta(montoActual: number, montoObjetivo: number): number {
  if (montoObjetivo === 0) return 0;
  return Math.min((montoActual / montoObjetivo) * 100, 100);
}

export function calcularDiasRestantes(fechaLimite: Date): number {
  const hoy = new Date();
  const limite = new Date(fechaLimite);
  const diffTime = limite.getTime() - hoy.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 0);
}
