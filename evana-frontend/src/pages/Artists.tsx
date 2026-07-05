import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Music, Info, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import type { Artist } from '../types/event';
import { LineSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';

const Artists: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadArtists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.artists.findAll();
      setArtists(data ?? []);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger la liste des artistes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArtists();
  }, [loadArtists]);

  return (
    <div className="py-16 md:py-24 container mx-auto px-4 lg:px-6 max-w-6xl space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-100 text-secondary-dark text-xs font-semibold uppercase tracking-wider"
        >
          <Music className="w-3.5 h-3.5" />
          Lineup Officielle
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white"
        >
          Découvrez nos <span className="gradient-text">Artistes</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 dark:text-slate-400 max-w-md mx-auto"
        >
          Les talents incroyables qui monteront sur scène pour vous faire vibrer.
        </motion.p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="skeleton h-56 rounded-xl w-full" />
              <div className="skeleton h-6 w-1/2 rounded" />
              <LineSkeleton lines={2} />
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState rawError={error} onRetry={loadArtists} />
      ) : artists.length === 0 ? (
        <EmptyState
          icon={<Users className="w-9 h-9 text-primary" />}
          title="Aucun artiste programmé"
          description="La programmation des artistes n'est pas encore finalisée. Revenez très bientôt."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist, idx) => (
            <motion.article
              key={artist.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-soft hover:shadow-card transition-all duration-350 flex flex-col group"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-700">
                <img
                  src={artist.image || '/images/artists/placeholder.jpg'}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/65 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white tracking-tight">{artist.name}</h3>
                  <div className="flex gap-1.5 flex-wrap mt-2">
                    {artist.musicGenre?.map((genre) => (
                      <span
                        key={genre}
                        className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {artist.bio || "Aucune biographie disponible pour le moment."}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Info className="w-3.5 h-3.5" />
                  <span>En savoir plus</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Artists;