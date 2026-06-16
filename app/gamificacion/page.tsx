'use client';

import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { storage } from '@/lib/storage';
import { UserProgress } from '@/types';

export default function Gamificacion() {
  const [userProgress, setUserProgress] = useState<UserProgress>({ puntos: 0, nivel: 'Novato', logros: [] });

  useEffect(() => {
    setUserProgress(storage.getUserProgress());
  }, []);

  const logrosDisponibles = [
    { id: 'primera_entrada', nombre: 'Primera Entrada', descripcion: 'Escribe tu primera entrada en la bitácora', icono: '📝', puntos: 10 },
    { id: 'primera_meta', nombre: 'Primera Meta', descripcion: 'Crea tu primera meta financiera', icono: '🎯', puntos: 50 },
    { id: 'meta_completada', nombre: 'Meta Alcanzada', descripcion: 'Completa tu primera meta', icono: '🏆', puntos: 100 },
    { id: 'ahorrador_constante', nombre: 'Ahorrador Constante', descripcion: 'Guarda 5 simulaciones', icono: '💰', puntos: 50 },
    { id: 'mes_perfecto', nombre: 'Mes Perfecto', descripcion: 'Escribe 10 entradas en un mes', icono: '⭐', puntos: 100 },
    { id: 'experto_financiero', nombre: 'Experto Financiero', descripcion: 'Alcanza el nivel Experto', icono: '👑', puntos: 200 },
  ];

  const niveles = [
    { nombre: 'Novato', puntosMin: 0, color: 'bg-zinc-500' },
    { nombre: 'Intermedio', puntosMin: 100, color: 'bg-blue-500' },
    { nombre: 'Avanzado', puntosMin: 300, color: 'bg-purple-500' },
    { nombre: 'Experto', puntosMin: 500, color: 'bg-yellow-500' },
  ];

  const nivelActual = niveles.find(n => userProgress.nivel === n.nombre) || niveles[0];
  const siguienteNivel = niveles.find(n => n.puntosMin > userProgress.puntos);
  const puntosParaSiguiente = siguienteNivel ? siguienteNivel.puntosMin - userProgress.puntos : 0;

  const logrosDesbloqueados = logrosDisponibles.filter(l => userProgress.logros.includes(l.id));
  const logrosPendientes = logrosDisponibles.filter(l => !userProgress.logros.includes(l.id));

  return (
    <div className="space-y-6">
      <div className="mt-12 lg:mt-0">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Gamificación 🏆
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Tu progreso y logros financieros
        </p>
      </div>

      {/* Nivel y Puntos */}
      <Card title="Tu Nivel">
        <div className="flex items-center gap-6">
          <div className={`w-20 h-20 rounded-full ${nivelActual.color} flex items-center justify-center text-4xl`}>
            {userProgress.nivel === 'Novato' ? '🌱' : userProgress.nivel === 'Intermedio' ? '📈' : userProgress.nivel === 'Avanzado' ? '🚀' : '👑'}
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              {userProgress.nivel}
            </div>
            <div className="text-lg text-blue-600 dark:text-blue-400 mb-2">
              {userProgress.puntos} puntos
            </div>
            {siguienteNivel && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {puntosParaSiguiente} puntos para {siguienteNivel.nombre}
              </div>
            )}
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${nivelActual.color}`}
              style={{ 
                width: siguienteNivel 
                  ? `${((userProgress.puntos - nivelActual.puntosMin) / (siguienteNivel.puntosMin - nivelActual.puntosMin)) * 100}%`
                  : '100%'
              }}
            />
          </div>
        </div>
      </Card>

      {/* Logros Desbloqueados */}
      <Card title="Logros Desbloqueados">
        {logrosDesbloqueados.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400 text-center py-8">
            Aún no has desbloqueado logros. ¡Sigue usando la app!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {logrosDesbloqueados.map((logro) => (
              <div
                key={logro.id}
                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-500"
              >
                <div className="text-4xl mb-2">{logro.icono}</div>
                <div className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                  {logro.nombre}
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  {logro.descripcion}
                </div>
                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                  +{logro.puntos} puntos
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Logros Pendientes */}
      <Card title="Logros Pendientes">
        {logrosPendientes.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400 text-center py-8">
            ¡Felicidades! Has desbloqueado todos los logros 🎉
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {logrosPendientes.map((logro) => (
              <div
                key={logro.id}
                className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 opacity-70"
              >
                <div className="text-4xl mb-2 grayscale">{logro.icono}</div>
                <div className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                  {logro.nombre}
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  {logro.descripcion}
                </div>
                <div className="text-sm font-medium text-zinc-500 dark:text-zinc-500">
                  +{logro.puntos} puntos
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Cómo Ganar Puntos */}
      <Card title="Cómo Ganar Puntos">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <span className="text-2xl">📝</span>
            <div className="flex-1">
              <div className="font-medium text-zinc-900 dark:text-zinc-100">Escribir en bitácora</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">+10 puntos por entrada</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <span className="text-2xl">💰</span>
            <div className="flex-1">
              <div className="font-medium text-zinc-900 dark:text-zinc-100">Guardar simulación</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">+10 puntos por simulación</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <span className="text-2xl">🎯</span>
            <div className="flex-1">
              <div className="font-medium text-zinc-900 dark:text-zinc-100">Crear meta</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">+50 puntos por meta</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <span className="text-2xl">🏆</span>
            <div className="flex-1">
              <div className="font-medium text-zinc-900 dark:text-zinc-100">Completar meta</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">+100 puntos por meta completada</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
