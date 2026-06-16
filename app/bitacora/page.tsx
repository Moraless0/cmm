'use client';

import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { storage } from '@/lib/storage';
import { JournalEntry } from '@/types';

export default function Bitacora() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [categoria, setCategoria] = useState<'ahorro' | 'gasto' | 'emocion'>('ahorro');
  const [sentimiento, setSentimiento] = useState('😊');

  useEffect(() => {
    setEntries(storage.getJournal());
  }, []);

  const guardarEntrada = () => {
    if (!titulo.trim() || !contenido.trim()) {
      alert('Por favor completa el título y contenido');
      return;
    }

    const nuevaEntrada: JournalEntry = {
      id: Date.now().toString(),
      fecha: new Date(),
      titulo,
      contenido,
      categoria,
      sentimiento
    };

    storage.saveJournalEntry(nuevaEntrada);
    storage.addPoints(10);
    
    if (entries.length === 0) {
      storage.addAchievement('primera_entrada');
    }

    setEntries([...entries, nuevaEntrada]);
    setTitulo('');
    setContenido('');
    alert('¡Entrada guardada! +10 puntos');
  };

  const eliminarEntrada = (id: string) => {
    storage.deleteJournalEntry(id);
    setEntries(entries.filter(e => e.id !== id));
  };

  const categoriaEmoji = {
    ahorro: '💰',
    gasto: '💸',
    emocion: '💭'
  };

  return (
    <div className="space-y-6">
      <div className="mt-12 lg:mt-0">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Bitácora Emocional 📝
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Registra tus reflexiones y emociones financieras
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario */}
        <Card title="Nueva Entrada">
          <div className="space-y-4">
            <Input
              label="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Ahorro del mes"
              required
            />
            
            <div>
              <label className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Categoría
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as any)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              >
                <option value="ahorro">💰 Ahorro</option>
                <option value="gasto">💸 Gasto</option>
                <option value="emocion">💭 Emoción</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Sentimiento
              </label>
              <div className="flex gap-2">
                {['😊', '😐', '😔', '😤', '🎉', '😰'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setSentimiento(emoji)}
                    className={`p-2 text-2xl rounded-lg transition-colors ${
                      sentimiento === emoji
                        ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500'
                        : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Contenido
              </label>
              <textarea
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder="Escribe tus reflexiones aquí..."
                rows={4}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 resize-none"
                required
              />
            </div>

            <Button onClick={guardarEntrada} className="w-full">
              💾 Guardar Entrada
            </Button>
          </div>
        </Card>

        {/* Lista de entradas */}
        <Card title="Entradas Anteriores">
          {entries.length === 0 ? (
            <p className="text-zinc-600 dark:text-zinc-400 text-center py-8">
              No hay entradas aún. ¡Comienza tu bitácora financiera!
            </p>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {entries.slice().reverse().map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border-l-4 border-blue-500"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{entry.sentimiento}</span>
                      <div>
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {entry.titulo}
                        </div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                          {categoriaEmoji[entry.categoria]} {entry.categoria} • {new Date(entry.fecha).toLocaleDateString('es-MX')}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => eliminarEntrada(entry.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    {entry.contenido}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
