import React from 'react';
import type { EventCategory, EventStatus } from '../../types/event';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary:   'bg-primary-100 text-primary dark:bg-primary-900/40 dark:text-primary-200',
  secondary: 'bg-secondary-100 text-secondary-dark dark:bg-yellow-900/40 dark:text-yellow-300',
  success:   'bg-success-light text-success-dark dark:bg-green-900/40 dark:text-green-300',
  danger:    'bg-danger-light text-danger-dark dark:bg-red-900/40 dark:text-red-300',
  warning:   'bg-warning-light text-warning-dark dark:bg-yellow-900/40 dark:text-yellow-300',
  info:      'bg-info-light text-info dark:bg-blue-900/40 dark:text-blue-300',
  neutral:   'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

const dotClasses: Record<BadgeVariant, string> = {
  primary:   'bg-primary',
  secondary: 'bg-secondary',
  success:   'bg-success',
  danger:    'bg-danger',
  warning:   'bg-warning',
  info:      'bg-info',
  neutral:   'bg-slate-400',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs rounded-md',
  md: 'px-2.5 py-1 text-xs rounded-lg',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  className = '',
}) => (
  <span
    className={[
      'inline-flex items-center gap-1.5 font-semibold tracking-wide',
      variantClasses[variant],
      sizeClasses[size],
      className,
    ].join(' ')}
  >
    {dot && (
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotClasses[variant]}`} />
    )}
    {children}
  </span>
);

/* ── Helpers de mapping métier ── */

export const categoryVariant: Record<EventCategory, BadgeVariant> = {
  music:    'primary',
  concert:  'secondary',
  festival: 'success',
  workshop: 'info',
  other:    'neutral',
};

export const categoryLabel: Record<EventCategory, string> = {
  music:    'Musique',
  concert:  'Concert',
  festival: 'Festival',
  workshop: 'Atelier',
  other:    'Autre',
};

export const statusVariant: Record<EventStatus, BadgeVariant> = {
  upcoming:  'primary',
  ongoing:   'success',
  completed: 'neutral',
  cancelled: 'danger',
};

export const statusLabel: Record<EventStatus, string> = {
  upcoming:  'À venir',
  ongoing:   'En cours',
  completed: 'Terminé',
  cancelled: 'Annulé',
};

export default Badge;
