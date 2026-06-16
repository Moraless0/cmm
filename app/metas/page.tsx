'use client';

import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { storage } from '@/lib/storage';
import { formatearMoneda, calcularProgresoMeta, calcularDiasRestantes } from '@/lib/calculations';
import { FinancialGoal } from '@/types';

export default function Metas() {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [nombre, setNombre] = useState('');
  const [montoObjetivo, setMontoObjetivo] = useState(0);
  const [montoActual, setMontoActual] = useState(0);
  const [fechaLimite, setFechaLimite] = useState('');
  const [categoria, setCategoria] = useState('general');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setGoals(storage.getGoals());
  }, []);

  const guardarMeta = () => {
    if (!nombre.trim() || montoObjetivo <= 0) {
      alert('Por favor completa el nombre y monto objetivo');
      return;
    }

    const meta: FinancialGoal = {
      id: editingId || Date.now().toString(),
      nombre,
      montoObjetivo,
      montoActual,
      fechaLimite: new Date(fechaLimite),
      categoria,
      completada: montoActual >= montoObjetivo
    };

    storage.saveGoal(meta);
    storage.addPoints(50);

    if (!editingId) {
      if (goals.length === 0) {
        storage.addAchievement('primera_meta');
      }
    }

    setGoals(storage.getGoals());
    limpiarFormulario();
    alert(editingId ? '¡Meta actualizada! +50 puntos' : '¡Meta creada! +50 puntos');
  };

  const editarMeta = (goal: FinancialGoal) => {
    setEditingId(goal.id);
    setNombre(goal.nombre);
    setMontoObjetivo(goal.montoObjetivo);
    setMontoActual(goal.montoActual);
    setFechaLimite(new Date(goal.fechaLimite).toISOString().split('T')[0]);
    setCategoria(goal.categoria);
  };

  const eliminarMeta = (id: string) => {
    storage.deleteGoal(id);
    setGoals(goals.filter(g => g.id !== id));
  };

  const actualizarProgreso = (id: string, nuevoMonto: number) => {
    const goal = goals.find(g => g.id === id);
    if (goal) {
      const actualizada = { ...goal, montoActual: nuevoMonto, completada: nuevoMonto >= goal.montoObjetivo };
      storage.saveGoal(actualizada);
      
      if (actualizada.completada && !goal.completada) {
        storage.addPoints(100);
        storage.addAchievement('meta_completada');
        alert('¡Felicidades! Meta completada 🎉 +100 puntos');
      }
      
      setGoals(storage.getGoals());
    }
  };

  const limpiarFormulario = () => {
    setEditingId(null);
    setNombre('');
    setMontoObjetivo(0);
    setMontoActual(0);
    setFechaLimite('');
    setCategoria('general');
  };

  const categoriaIconos = {
    general: '🎯',
    viaje: '✈️',
    casa: '🏠',
    coche: '🚗',
    educacion: '📚',
    emergencia: '🆘',
    inversion: '📈',
    retiro: '🏖️'
  };

  return (
    <div className="space-y-6">
      <div className="mt-12 lg:mt-0">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Metas Financieras 🎯
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Establece y sigue tus objetivos financieros
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario */}
        <Card title={editingId ? 'Editar Meta' : 'Nueva Meta'}>
          <div className="space-y-4">
            <Input
              label="Nombre de la Meta"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Vacaciones en verano"
              required
            />
            
            <Input
              type="number"
              label="Monto Objetivo"
              value={montoObjetivo}
              onChange={(e) => setMontoObjetivo(Number(e.target.value))}
              placeholder="Ej: 10000"
              min={0}
              required
            />

            {editingId && (
              <Input
                type="number"
                label="Monto Actual"
                value={montoActual}
                onChange={(e) => setMontoActual(Number(e.target.value))}
                placeholder="Ej: 5000"
                min={0}
              />
            )}

            <Input
              type="date"
              label="Fecha Límite"
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
              required
            />

            <div>
              <label className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Categoría
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              >
                {Object.entries(categoriaIconos).map(([key, icon]) => (
                  <option key={key} value={key}>
                    {icon} {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <Button onClick={guardarMeta} className="flex-1">
                {editingId ? '💾 Actualizar' : '💾 Crear Meta'}
              </Button>
              {editingId && (
                <Button onClick={limpiarFormulario} variant="secondary">
                  Cancelar
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Lista de metas */}
        <Card title="Tus Metas">
          {goals.length === 0 ? (
            <p className="text-zinc-600 dark:text-zinc-400 text-center py-8">
              No tienes metas aún. ¡Crea tu primera meta financiera!
            </p>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {goals.map((goal) => {
                const progreso = calcularProgresoMeta(goal.montoActual, goal.montoObjetivo);
                const diasRestantes = calcularDiasRestantes(goal.fechaLimite);
                
                return (
                  <div
                    key={goal.id}
                    className={`p-4 rounded-lg border-2 ${
                      goal.completada
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{categoriaIconos[goal.categoria as keyof typeof categoriaIconos] || '🎯'}</span>
                        <div>
                          <div className="font-medium text-zinc-900 dark:text-zinc-100">
                            {goal.nombre}
                          </div>
                          <div className="text-sm text-zinc-600 dark:text-zinc-400">
                            {diasRestantes > 0 ? `${diasRestantes} días restantes` : 'Fecha límite alcanzada'}
                          </div>
                        </div>
                      </div>
                      {goal.completada && (
                        <span className="text-2xl">✅</span>
                      )}
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-600 dark:text-zinc-400">
                          {formatearMoneda(goal.montoActual)} / {formatearMoneda(goal.montoObjetivo)}
                        </span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {progreso.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            goal.completada
                              ? 'bg-green-500'
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${progreso}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => editarMeta(goal)}
                        variant="secondary"
                        className="flex-1 text-sm"
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => {
                          const nuevoMonto = prompt('Nuevo monto actual:', goal.montoActual.toString());
                          if (nuevoMonto) actualizarProgreso(goal.id, Number(nuevoMonto));
                        }}
                        variant="secondary"
                        className="flex-1 text-sm"
                      >
                        Actualizar
                      </Button>
                      <Button
                        onClick={() => eliminarMeta(goal.id)}
                        variant="danger"
                        className="text-sm px-3"
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
