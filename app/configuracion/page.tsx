'use client';

import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { storage } from '@/lib/storage';
import ThemeToggle from '../components/ThemeToggle';

export default function Configuracion() {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const exportarDatos = () => {
    const datos = {
      journal: storage.getJournal(),
      goals: storage.getGoals(),
      userProgress: storage.getUserProgress(),
      simulaciones: storage.getSimulaciones(),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finplan-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const eliminarTodosDatos = () => {
    localStorage.removeItem('financial_journal');
    localStorage.removeItem('financial_goals');
    localStorage.removeItem('user_progress');
    localStorage.removeItem('simulaciones_guardadas');
    localStorage.removeItem('theme_preference');
    alert('Todos los datos han sido eliminados');
    window.location.reload();
  };

  const stats = {
    entradas: storage.getJournal().length,
    metas: storage.getGoals().length,
    simulaciones: storage.getSimulaciones().length,
    puntos: storage.getUserProgress().puntos
  };

  return (
    <div className="space-y-6">
      <div className="mt-12 lg:mt-0">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Configuración ⚙️
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Personaliza tu experiencia
        </p>
      </div>

      {/* Apariencia */}
      <Card title="Apariencia">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
              Tema
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Cambia entre modo claro y oscuro
            </div>
          </div>
          <ThemeToggle />
        </div>
      </Card>

      {/* Estadísticas de Almacenamiento */}
      <Card title="Estadísticas de Almacenamiento">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.entradas}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Entradas
            </div>
          </div>
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.metas}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Metas
            </div>
          </div>
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {stats.simulaciones}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Simulaciones
            </div>
          </div>
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.puntos}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Puntos
            </div>
          </div>
        </div>
      </Card>

      {/* Datos */}
      <Card title="Gestión de Datos">
        <div className="space-y-4">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
            <div className="font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              Exportar Datos
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
              Descarga una copia de seguridad de todos tus datos en formato JSON
            </p>
            <Button onClick={exportarDatos}>
              📥 Exportar Backup
            </Button>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="font-medium text-red-900 dark:text-red-100 mb-2">
              Zona de Peligro
            </div>
            <p className="text-sm text-red-700 dark:text-red-300 mb-3">
              Esta acción eliminará permanentemente todos tus datos. Esta acción no se puede deshacer.
            </p>
            {!showConfirmDelete ? (
              <Button onClick={() => setShowConfirmDelete(true)} variant="danger">
                🗑️ Eliminar Todos los Datos
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={eliminarTodosDatos} variant="danger">
                  ✅ Confirmar Eliminación
                </Button>
                <Button onClick={() => setShowConfirmDelete(false)} variant="secondary">
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Información */}
      <Card title="Información de la Aplicación">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Versión</span>
            <span className="text-zinc-900 dark:text-zinc-100">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Framework</span>
            <span className="text-zinc-900 dark:text-zinc-100">Next.js 16.2.9</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Almacenamiento</span>
            <span className="text-zinc-900 dark:text-zinc-100">Local (localStorage)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Desarrollado para</span>
            <span className="text-zinc-900 dark:text-zinc-100">Campuslands</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
