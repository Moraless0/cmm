'use client';

import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { calcularInteresCompuesto, formatearMoneda } from '@/lib/calculations';
import { storage } from '@/lib/storage';
import { ResultadoSimulacion } from '@/types';

export default function Simulador() {
  const [montoInicial, setMontoInicial] = useState(0);
  const [aportacionMensual, setAportacionMensual] = useState(0);
  const [tasaInteresAnual, setTasaInteresAnual] = useState(5);
  const [periodoMeses, setPeriodoMeses] = useState(12);
  const [resultado, setResultado] = useState<ResultadoSimulacion | null>(null);

  const calcular = () => {
    const result = calcularInteresCompuesto(montoInicial, aportacionMensual, tasaInteresAnual, periodoMeses);
    setResultado(result);
  };

  const guardarSimulacion = () => {
    if (!resultado) return;
    
    const simulacion = {
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      montoInicial,
      aportacionMensual,
      tasaInteresAnual,
      periodoMeses,
      resultado
    };
    
    storage.saveSimulacion(simulacion);
    storage.addPoints(10);
    alert('¡Simulación guardada! +10 puntos');
  };

  return (
    <div className="space-y-6">
      <div className="mt-12 lg:mt-0">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Simulador de Ahorro 💰
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Calcula cómo crecerá tu dinero con interés compuesto
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario */}
        <Card title="Parámetros de Simulación">
          <div className="space-y-4">
            <Input
              type="number"
              label="Monto Inicial"
              value={montoInicial}
              onChange={(e) => setMontoInicial(Number(e.target.value))}
              placeholder="Ej: 10000"
              min={0}
            />
            <Input
              type="number"
              label="Aportación Mensual"
              value={aportacionMensual}
              onChange={(e) => setAportacionMensual(Number(e.target.value))}
              placeholder="Ej: 500"
              min={0}
            />
            <Input
              type="number"
              label="Tasa de Interés Anual (%)"
              value={tasaInteresAnual}
              onChange={(e) => setTasaInteresAnual(Number(e.target.value))}
              placeholder="Ej: 5"
              min={0}
              max={100}
              step={0.1}
            />
            <Input
              type="number"
              label="Período (meses)"
              value={periodoMeses}
              onChange={(e) => setPeriodoMeses(Number(e.target.value))}
              placeholder="Ej: 12"
              min={1}
              max={600}
            />
            <Button onClick={calcular} className="w-full">
              Calcular
            </Button>
          </div>
        </Card>

        {/* Resultados */}
        {resultado && (
          <Card title="Resultados">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                  Monto Final
                </div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatearMoneda(resultado.montoFinal)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    Total Invertido
                  </div>
                  <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {formatearMoneda(montoInicial + aportacionMensual * periodoMeses)}
                  </div>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    Interés Ganado
                  </div>
                  <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {formatearMoneda(resultado.montoFinal - (montoInicial + aportacionMensual * periodoMeses))}
                  </div>
                </div>
              </div>

              <Button onClick={guardarSimulacion} variant="secondary" className="w-full">
                💾 Guardar Simulación
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Tabla de progreso */}
      {resultado && (
        <Card title="Progreso Mensual">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left py-2 px-3 text-zinc-900 dark:text-zinc-100">Mes</th>
                  <th className="text-right py-2 px-3 text-zinc-900 dark:text-zinc-100">Monto</th>
                  <th className="text-right py-2 px-3 text-zinc-900 dark:text-zinc-100">Interés</th>
                </tr>
              </thead>
              <tbody>
                {resultado.resultados.map((r) => (
                  <tr key={r.mes} className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-2 px-3 text-zinc-700 dark:text-zinc-300">{r.mes}</td>
                    <td className="py-2 px-3 text-right text-zinc-900 dark:text-zinc-100">
                      {formatearMoneda(r.monto)}
                    </td>
                    <td className="py-2 px-3 text-right text-green-600 dark:text-green-400">
                      {formatearMoneda(r.interes)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
