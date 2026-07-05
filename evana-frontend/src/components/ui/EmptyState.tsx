import React from 'react';
import { Calendar, Music, Search, Star, Ticket } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const defaultIcons = [Calendar, Music, Search, Star, Ticket];

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'Aucun résultat',
  description = 'Il n\'y a rien à afficher pour le moment.',
  action,
  className = '',
}) => {
  const DefaultIcon = defaultIcons[0];

  return (
    <div
      className={`flex flex-col items-center justify-center py-20 px-6 text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Icône dans un cercle dégradé */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 flex items-center justify-center">
          {icon ?? <DefaultIcon className="w-9 h-9 text-primary" />}
        </div>
        {/* Anneau décoratif */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 scale-125" />
      </div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-light transition-all duration-200 hover:shadow-glow-sm focus-visible:outline-2 focus-visible:outline-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

/* ── No Search Result ── */
export const NoSearchResult: React.FC<{ query?: string; onReset?: () => void }> = ({
  query,
  onReset,
}) => (
  <EmptyState
    icon={<Search className="w-9 h-9 text-primary" />}
    title="Aucun événement trouvé"
    description={
      query
        ? `Nous n'avons trouvé aucun résultat pour "${query}". Essayez avec d'autres mots-clés ou filtres.`
        : 'Modifiez vos filtres pour voir plus d\'événements.'
    }
    action={onReset ? { label: 'Réinitialiser les filtres', onClick: onReset } : undefined}
  />
);

/* ── No Events ── */
export const NoEvents: React.FC = () => (
  <EmptyState
    icon={<Calendar className="w-9 h-9 text-primary" />}
    title="Aucun événement disponible"
    description="Il n'y a pas d'événements programmés pour le moment. Revenez bientôt !"
  />
);

export default EmptyState;
