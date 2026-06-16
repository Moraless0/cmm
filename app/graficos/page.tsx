'use client';

import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { storage } from '@/lib/storage';
import { formatearMoneda } from '@/lib/calculations';
import { FinancialGoal, JournalEntry } from '@/types';

export default function Graficos() {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    setGoals(storage.getGoals());
    setJournalEntries(storage.getJournal());
  }, []);

  const categoriaData = journalEntries.reduce((acc, entry) => {
    acc[entry.categoria] = (acc[entry.categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalAhorro = goals.reduce((sum, goal) => sum + goal.montoActual, 0);
  const totalObjetivo = goals.reduce((sum, goal) => sum + goal.montoObjetivo, 0);

  const categoriaColors = {
    ahorro: 'bg-green-500',
    gasto: 'bg-red-500',
    emocion: 'bg-blue-500'
  };

  const categoriaLabels = {
    ahorro: '💰 Ahorro',
    gasto: '💸 Gasto',
    emocion: '💭 Emoción'
  };

  return (
    <div className="space-y-6">
      <div className="mt-12 lg:mt-0">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Gráficos y Análisis 📈
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Visualiza tu progreso financiero
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Metas */}
        <Card title="Progreso de Metas">
          {goals.length === 0 ? (
            <p className="text-zinc-600 dark:text-zinc-400 text-center py-8">
              No hay metas para mostrar
            </p>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const progreso = (goal.montoActual / goal.montoObjetivo) * 100;
                return (
                  <div key={goal.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                        {goal.nombre}
                      </span>
                      <span className="text-zinc-600 dark:text-zinc-400">
                        {formatearMoneda(goal.montoActual)} / {formatearMoneda(goal.montoObjetivo)}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full transition-all ${
                          goal.completada ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(progreso, 100)}%` }}
                      />
                    </div>
                    <div className="text-right text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                      {progreso.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Gráfico de Categorías de Bitácora */}
        <Card title="Distribución de Entradas">
          {journalEntries.length === 0 ? (
            <p className="text-zinc-600 dark:text-zinc-400 text-center py-8">
              No hay entradas para mostrar
            </p>
          ) : (
            <div className="space-y-4">
              {Object.entries(categoriaData).map(([categoria, count]) => {
                const porcentaje = (count / journalEntries.length) * 100;
                return (
                  <div key={categoria}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                        {categoriaLabels[categoria as keyof typeof categoriaLabels] || categoria}
                      </span>
                      <span className="text-zinc-600 dark:text-zinc-400">
                        {count} entradas ({porcentaje.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full transition-all ${
                          categoriaColors[categoria as keyof typeof categoriaColors] || 'bg-zinc-500'
                        }`}
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Resumen General */}
        <Card title="Resumen General">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                Total Ahorrado
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatearMoneda(totalAhorro)}
              </div>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                Total Objetivo
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatearMoneda(totalObjetivo)}
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                Progreso Global
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {totalObjetivo > 0 ? ((totalAhorro / totalObjetivo) * 100).toFixed(1) : 0}%
              </div>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                Metas Completadas
              </div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {goals.filter(g => g.completada).length} / {goals.length}
              </div>
            </div>
          </div>
        </Card>

        {/* Estadísticas de Bitácora */}
        <Card title="Estadísticas de Bitácora">
          <div className="space-y-4">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                Total Entradas
              </div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {journalEntries.length}
              </div>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                Entradas esta semana
              </div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {journalEntries.filter(e => {
                  const entryDate = new Date(e.fecha);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return entryDate >= weekAgo;
                }).length}
              </div>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
              <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                Categoría más frecuente
              </div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {Object.entries(categoriaData).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
