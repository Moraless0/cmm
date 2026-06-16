'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Simulador', path: '/simulador', icon: '💰' },
    { name: 'Bitácora', path: '/bitacora', icon: '📝' },
    { name: 'Metas', path: '/metas', icon: '🎯' },
    { name: 'Gráficos', path: '/graficos', icon: '📈' },
    { name: 'Gamificación', path: '/gamificacion', icon: '🏆' },
    { name: 'Configuración', path: '/configuracion', icon: '⚙️' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-600 text-white shadow-lg"
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isOpen ? (
            <line x1="18" y1="6" x2="6" y2="18"></line>
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </>
          )}
        </svg>
      </button>

      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-zinc-900 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              💵 FinPlan
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Tu plan financiero
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Theme toggle */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Tema</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
