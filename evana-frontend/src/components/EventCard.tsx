import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Star, Heart, Share2, Clock } from 'lucide-react';
import type { Event } from '../types/event';
import { Badge, categoryVariant, categoryLabel, statusVariant, statusLabel } from './ui/Badge';

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
  index?: number;
}

/* ── Formatters ── */
const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

const formatPrice = (price: number) =>
  new Intl.NumberFormat('fr-FR').format(price) + ' CFA';

/* ── Disponibilité ── */
function getAvailabilityInfo(available: number): {
  label: string;
  color: string;
  barColor: string;
  percent: number;
} {
  const TOTAL_ESTIMATE = 500; // estimation
  const percent = Math.min(100, (available / TOTAL_ESTIMATE) * 100);

  if (available === 0)
    return { label: 'Complet', color: 'text-danger', barColor: 'bg-danger', percent: 0 };
  if (available < 20)
    return { label: `${available} places`, color: 'text-danger', barColor: 'bg-danger', percent };
  if (available < 100)
    return { label: `${available} places`, color: 'text-warning', barColor: 'bg-warning', percent };
  return { label: `${available} places`, color: 'text-success', barColor: 'bg-success', percent };
}

/* ── Animation variants ── */
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.08,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

/* ── Composant ── */
const EventCard: React.FC<EventCardProps> = memo(({ event, onViewDetails, index = 0 }) => {
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);

  const avail = getAvailabilityInfo(event.ticketsAvailable);
  const isSoldOut = event.ticketsAvailable === 0 || event.status === 'cancelled';

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: `Découvrez ${event.name} sur EVANA !`,
        url: window.location.href,
      }).catch(() => {});
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((p) => !p);
  };

  return (
    <motion.article
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-soft hover:shadow-card transition-shadow duration-300 flex flex-col"
      aria-label={`Événement : ${event.name}`}
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden aspect-[16/9] bg-slate-100 dark:bg-slate-700">
        {!imgError ? (
          <img
            src={event.image}
            alt={event.name}
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30">
            <span className="text-4xl">🎵</span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Badges (haut gauche) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <Badge variant={categoryVariant[event.category]} size="sm">
            {categoryLabel[event.category]}
          </Badge>
        </div>

        {/* Badge statut (haut droit) */}
        <div className="absolute top-3 right-3">
          <Badge variant={statusVariant[event.status]} size="sm" dot>
            {statusLabel[event.status]}
          </Badge>
        </div>

        {/* Actions (favoris + partage) — bas droit */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleLike}
            aria-label={liked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            aria-pressed={liked}
            className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 flex items-center justify-center shadow-soft hover:scale-110 transition-transform duration-150"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${liked ? 'fill-danger text-danger' : 'text-slate-600 dark:text-slate-300'}`}
            />
          </button>
          <button
            onClick={handleShare}
            aria-label="Partager cet événement"
            className="w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 flex items-center justify-center shadow-soft hover:scale-110 transition-transform duration-150"
          >
            <Share2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {/* Note étoiles */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 rounded-full px-2 py-1">
          <Star className="w-3 h-3 fill-secondary text-secondary" aria-hidden="true" />
          <span className="text-white text-xs font-semibold">4.8</span>
        </div>
      </div>

      {/* ── Contenu ── */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Titre */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
          {event.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        {/* Meta infos */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Calendar className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
            <span>{formatDate(event.date)}</span>
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" aria-hidden="true" />
            <span>{formatTime(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <MapPin className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Disponibilité */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-medium">
              <Users className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span className={avail.color}>{avail.label}</span>
            </div>
          </div>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${avail.barColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${avail.percent}%` }}
              transition={{ duration: 0.8, delay: index * 0.08 + 0.3 }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Footer : prix + bouton */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          <div>
            <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">Prix</div>
            <div className="text-xl font-bold text-primary">{formatPrice(event.ticketsPrice)}</div>
          </div>

          <motion.button
            whileHover={{ scale: isSoldOut ? 1 : 1.04 }}
            whileTap={{ scale: isSoldOut ? 1 : 0.97 }}
            onClick={() => !isSoldOut && onViewDetails(event)}
            disabled={isSoldOut}
            aria-label={isSoldOut ? `${event.name} — Complet` : `Réserver ${event.name}`}
            className={[
              'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-primary',
              isSoldOut
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-light hover:shadow-glow-sm active:scale-95',
            ].join(' ')}
          >
            {isSoldOut ? 'Complet' : 'Réserver'}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
});

EventCard.displayName = 'EventCard';
export default EventCard;