import React from 'react';
import { AlertTriangle, WifiOff, ShieldOff, RefreshCw, ServerCrash } from 'lucide-react';

type ErrorType = 'generic' | 'network' | 'notFound' | 'forbidden' | 'server';

interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

const errorConfig: Record<
  ErrorType,
  { Icon: React.ElementType; title: string; description: string; iconColor: string }
> = {
  generic: {
    Icon: AlertTriangle,
    title: 'Une erreur est survenue',
    description:
      'Impossible de charger le contenu. Réessayez dans quelques instants.',
    iconColor: 'text-warning',
  },
  network: {
    Icon: WifiOff,
    title: 'Problème de connexion',
    description:
      'Impossible de charger les événements. Vérifiez votre connexion internet et réessayez.',
    iconColor: 'text-danger',
  },
  notFound: {
    Icon: ServerCrash,
    title: 'Page introuvable',
    description:
      'Le contenu que vous recherchez n\'existe pas ou a été déplacé.',
    iconColor: 'text-slate-400',
  },
  forbidden: {
    Icon: ShieldOff,
    title: 'Accès refusé',
    description:
      'Vous n\'avez pas les permissions nécessaires pour accéder à cette ressource.',
    iconColor: 'text-danger',
  },
  server: {
    Icon: ServerCrash,
    title: 'Erreur serveur',
    description:
      'Nos serveurs rencontrent un problème. Notre équipe a été notifiée. Réessayez dans quelques instants.',
    iconColor: 'text-danger',
  },
};

function detectErrorType(message?: string): ErrorType {
  if (!message) return 'generic';
  const lower = message.toLowerCase();
  if (lower.includes('network') || lower.includes('fetch') || lower.includes('connexion'))
    return 'network';
  if (lower.includes('403') || lower.includes('forbidden')) return 'forbidden';
  if (lower.includes('404') || lower.includes('not found')) return 'notFound';
  if (lower.includes('500') || lower.includes('server')) return 'server';
  return 'generic';
}

export const ErrorState: React.FC<ErrorStateProps & { rawError?: string }> = ({
  type,
  title,
  description,
  onRetry,
  className = '',
  rawError,
}) => {
  // Détection automatique du type si non fourni
  const resolvedType = type ?? detectErrorType(rawError);
  const config = errorConfig[resolvedType];

  const { Icon, iconColor } = config;
  const displayTitle = title ?? config.title;
  const displayDesc = description ?? config.description;

  return (
    <div
      className={`flex flex-col items-center justify-center py-20 px-6 text-center ${className}`}
      role="alert"
      aria-live="assertive"
    >
      {/* Icône */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <Icon className={`w-9 h-9 ${iconColor}`} />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-slate-200 dark:border-slate-700 scale-125" />
      </div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        {displayTitle}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
        {displayDesc}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-light transition-all duration-200 hover:shadow-glow-sm focus-visible:outline-2 focus-visible:outline-primary"
        >
          <RefreshCw className="w-4 h-4" />
          Réessayer
        </button>
      )}
    </div>
  );
};

export default ErrorState;
