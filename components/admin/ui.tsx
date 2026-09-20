'use client';

import { useState, type ReactNode } from 'react';

export const INPUT_STYLE = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
} as const;

export function Field({
  label,
  hint,
  wide,
  children,
}: {
  label: string;
  hint?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={wide ? 'block sm:col-span-2' : 'block'}>
      <span className="lf-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint ? (
        <span className="mt-1 block text-[11px]" style={{ color: 'var(--muted)', opacity: 0.75 }}>
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function TextInput({ className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...rest}
      className={'w-full rounded-[10px] px-3 py-2 text-[13px] outline-none ' + (className || '')}
      style={INPUT_STYLE}
    />
  );
}

export function TextArea({ className, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={3}
      {...rest}
      className={'w-full rounded-[10px] px-3 py-2 text-[13px] leading-relaxed outline-none ' + (className || '')}
      style={INPUT_STYLE}
    />
  );
}

export function Select({
  value,
  options,
  onChange,
}: {
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-[10px] px-3 py-2 text-[13px] outline-none"
      style={INPUT_STYLE}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left text-[13px]"
      style={INPUT_STYLE}
    >
      <span
        className="relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition"
        style={{ background: checked ? 'var(--accent)' : 'var(--border)' }}
      >
        <span
          className="absolute h-3 w-3 rounded-full bg-white transition-all"
          style={{ left: checked ? '15px' : '3px' }}
        />
      </span>
      <span style={{ color: checked ? 'var(--text)' : 'var(--muted)' }}>{label}</span>
    </button>
  );
}

export function Btn({
  children,
  onClick,
  tone,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: 'ghost' | 'accent';
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="lf-chip px-3 py-1.5 text-[12.5px] disabled:opacity-60"
      style={{
        background: tone === 'accent' ? 'var(--accent-soft)' : 'var(--surface)',
        borderColor: tone === 'accent' ? 'var(--accent)' : 'var(--border)',
      }}
    >
      {children}
    </button>
  );
}

export function IconBtn({
  children,
  onClick,
  title,
}: {
  children: ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className="lf-mono rounded-[8px] px-2 py-1 text-[10.5px] uppercase tracking-[0.08em]"
      style={{ background: 'var(--surface-strong)', border: '1px solid var(--border)', color: 'var(--muted)' }}
    >
      {children}
    </button>
  );
}

/** Minimal HTML5 drag-and-drop reordering: grab a handle, drop it on another row. */
export function useDragList(onMove: (from: number, to: number) => void) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function handleProps(index: number) {
    return {
      draggable: true,
      onDragStart: () => setDragIndex(index),
      onDragEnd: () => setDragIndex(null),
      onDragOver: (event: React.DragEvent) => {
        event.preventDefault();
        if (dragIndex !== null && dragIndex !== index) {
          onMove(dragIndex, index);
          setDragIndex(index);
        }
      },
    };
  }

  return { dragIndex, handleProps };
}

export function listMove<T>(list: readonly T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return [...list];
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function listInsert<T>(list: readonly T[], index: number, value: T): T[] {
  const next = [...list];
  next.splice(index, 0, value);
  return next;
}

export function listRemove<T>(list: readonly T[], index: number): T[] {
  return list.filter((_, i) => i !== index);
}

export function listReplace<T>(list: readonly T[], index: number, value: T): T[] {
  return list.map((item, i) => (i === index ? value : item));
}
