'use client';

import React, { useEffect, useState } from 'react';
import Card from './components/Card';
import Button from './components/Button';
import { storage } from '@/lib/storage';
import { formatearMoneda } from '@/lib/calculations';
import { UserProgress, FinancialGoal, JournalEntry } from '@/types';

export default function Dashboard() {
  const [userProgress, setUserProgress] = useState<UserProgress>({ puntos: 0, nivel: 'Novato', logros: [] });
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    setUserProgress(storage.getUserProgress());
    setGoals(storage.getGoals());
    setJournalEntries(storage.getJournal());
  }, []);

  const totalAhorro = goals.reduce((sum, goal) => sum + goal.montoActual, 0);
  const metasCompletadas = goals.filter(g => g.completada).length;
  const metasPendientes = goals.length - metasCompletadas;

  return (
    <div className="space-y-6">
      <div className="mt-12 lg:mt-0">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Bienvenido a FinPlan 💵
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Tu centro de control financiero personal
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-4xl mb-2">💰</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatearMoneda(totalAhorro)}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Total Ahorrado</div>
        </Card>

        <Card className="text-center">
          <div className="text-4xl mb-2">🎯</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {metasCompletadas}/{goals.length}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Metas Completadas</div>
        </Card>

        <Card className="text-center">
          <div className="text-4xl mb-2">📝</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {journalEntries.length}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Entradas en Bitácora</div>
        </Card>

        <Card className="text-center">
          <div className="text-4xl mb-2">🏆</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {userProgress.puntos}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Puntos - {userProgress.nivel}</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Acciones Rápidas">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={() => window.location.href = '/simulador'} className="w-full">
            💰 Nueva Simulación
          </Button>
          <Button onClick={() => window.location.href = '/bitacora'} variant="secondary" className="w-full">
            📝 Escribir en Bitácora
          </Button>
          <Button onClick={() => window.location.href = '/metas'} variant="secondary" className="w-full">
            🎯 Crear Meta
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Metas Recientes">
          {goals.length === 0 ? (
            <p className="text-zinc-600 dark:text-zinc-400 text-center py-4">
              No tienes metas aún. ¡Crea tu primera meta!
            </p>
          ) : (
            <div className="space-y-3">
              {goals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                  <div>
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{goal.nombre}</div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      {formatearMoneda(goal.montoActual)} / {formatearMoneda(goal.montoObjetivo)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {Math.round((goal.montoActual / goal.montoObjetivo) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Últimas Entradas">
          {journalEntries.length === 0 ? (
            <p className="text-zinc-600 dark:text-zinc-400 text-center py-4">
              No hay entradas aún. ¡Comienza tu bitácora financiera!
            </p>
          ) : (
            <div className="space-y-3">
              {journalEntries.slice(-3).reverse().map((entry) => (
                <div key={entry.id} className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">{entry.titulo}</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {new Date(entry.fecha).toLocaleDateString('es-MX')} - {entry.categoria}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
