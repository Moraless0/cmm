import React from 'react';

interface InputProps {
  type?: 'text' | 'number' | 'date' | 'email' | 'password';
  label?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export default function Input({ 
  type = 'text', 
  label, 
  value, 
  onChange, 
  placeholder, 
  className = '',
  required = false,
  min,
  max,
  step
}: InputProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        className="px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
      />
    </div>
  );
}
