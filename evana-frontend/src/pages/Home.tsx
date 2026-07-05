import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Ticket, Calendar, MapPin, Sparkles, ArrowRight, TrendingUp } from 'lucide-react';

import EventCard from '../components/EventCard';
import { SearchBar } from '../components/ui/SearchBar';
import { EventGridSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { NoSearchResult, NoEvents } from '../components/ui/EmptyState';
import { api } from '../services/api';
import type { Event, EventCategory } from '../types/event';

import heroVideo from '../video/pexels-2022395.mp4';

/* type*/
type SortBy = 'date' | 'price-asc' | 'price-desc' | 'name';

/* anime*/
const heroVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const statsVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.6 + i * 0.1, duration: 0.4 },
  }),
};

/* donnee*/
const STATS = [
  { value: '+250', label: 'Événements', icon: Calendar },
  { value: '+500', label: 'Artistes', icon: Sparkles },
  { value: '+120', label: 'Villes', icon: MapPin },
  { value: '50K+', label: 'Visiteurs', icon: TrendingUp },
];

/* fonctionnalite*/
const FEATURES = [
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>, title: 'Recherche intelligente', desc: 'Trouvez rapidement ce qui vous correspond.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-ticket-icon lucide-ticket"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>, title: 'Billetterie claire', desc: 'Prix, places restantes, date et heure.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-lock-keyhole-icon lucide-lock-keyhole"><circle cx="12" cy="16" r="1"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/></svg>, title: 'Confiance & sécurité', desc: 'Accès protégé et parcours guidé.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>, title: 'Design premium', desc: 'UI moderne, responsive et accessible.' },
];

/* ── Composant Home ── */
const Home: React.FC = () => {
  const navigate = useNavigate();

  /* etat donnéees */
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* État recherche */
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<EventCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  /* Images hero */
  const heroImages = useMemo(
    () => [
      { src: '/images/artists/Gims-Dadju-Visu-News.jpg', alt: '' },
      { src: '/images/artists/vj.jpg', alt: '' },
      { src: '/images/artists/EE738F01-3447-4D14-9020-DAC9D6F831C3-696x367.jpeg', alt: '' },
    ],
    [],
  );

  /* Charge des événements */
  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.events.findAll();
      setEvents(data ?? []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  /* Filtrage + tri */
  const filteredEvents = useMemo(() => {
    let result = [...events];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q),
      );
    }

    if (category !== 'all') {
      result = result.filter((e) => e.category === category);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'price-asc':
          return a.ticketsPrice - b.ticketsPrice;
        case 'price-desc':
          return b.ticketsPrice - a.ticketsPrice;
        case 'name':
          return a.name.localeCompare(b.name, 'fr');
        default:
          return 0;
      }
    });

    return result;
  }, [events, searchQuery, category, sortBy]);

  const handleViewDetails = useCallback(
    (event: Event) => navigate('/tickets', { state: { event } }),
    [navigate],
  );

  const scrollToEvents = () => {
    document.getElementById('events')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setSortBy('date');
  };

  const hasActiveSearch = searchQuery || category !== 'all';

  /* ── Rendu ── */
  return (
    <div>
      <section
        className="relative min-h-[80vh] md:min-h-[88vh] overflow-hidden bg-slate-900"
        aria-label="Section héros"
      >
        {/* Vidé */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-primary-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />

        {/* Blobdécoratifs */}
        <div className="pointer-events-none absolute -top-32 left-1/4 w-80 h-80 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 rounded-full bg-secondary/15 blur-3xl" aria-hidden="true" />

        {/* Contenu Hero */}
        <div className="relative container mx-auto px-4 lg:px-6 min-h-[80vh] md:min-h-[88vh] flex items-center">
          <div className="w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 py-16">

              {/* Texte gauche */}
              <motion.div
                className="lg:col-span-7 text-center lg:text-left"
                variants={heroVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Badge "EVANA présente" */}
                <motion.div variants={heroItemVariants}>
                  <span className="inline-flex items-center gap-2 text-white/80 text-sm mb-5 uppercase tracking-[0.2em] font-medium">
                    <Sparkles className="w-4 h-4 text-secondary" aria-hidden="true" />
                    EVANA présente
                  </span>
                </motion.div>

                {/* H1 */}
                <motion.h1
                  variants={heroItemVariants}
                  className="text-white text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6"
                >
                  Soirée{' '}
                  <span className="gradient-text-hero">Nous à Nous</span>{' '}
                  <span className="block">2026</span>
                </motion.h1>

                {/* Soutitre */}
                <motion.p
                  variants={heroItemVariants}
                  className="text-white/70 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
                >
                  La plateforme premium pour vivre les meilleurs événements — festivals,
                  concerts et conférences, en un seul endroit.
                </motion.p>

                {/* Infos+ lieu */}
                <motion.div
                  variants={heroItemVariants}
                  className="flex flex-col sm:flex-row gap-3 mb-8 justify-center lg:justify-start"
                >
                  <div className="flex items-center gap-2.5 glass rounded-xl px-4 py-2.5">
                    <Calendar className="w-4 h-4 text-secondary" aria-hidden="true" />
                    <span className="text-white text-sm font-medium">10 – 12 août 2026</span>
                  </div>
                  <div className="flex items-center gap-2.5 glass rounded-xl px-4 py-2.5">
                    <MapPin className="w-4 h-4 text-secondary" aria-hidden="true" />
                    <span className="text-white text-sm font-medium">Palais des Congrès, Brazzaville</span>
                  </div>
                </motion.div>

                {/* Buttons */}
                <motion.div
                  variants={heroItemVariants}
                  className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
                >
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={scrollToEvents}
                    className="inline-flex items-center justify-center gap-2.5 bg-primary text-white px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-primary-light transition-all duration-200 hover:shadow-glow focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <Play className="w-4.5 h-4.5" aria-hidden="true" />
                    Découvrir les événements
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/tickets')}
                    className="inline-flex items-center justify-center gap-2.5 glass text-white border border-white/20 px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-white/15 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <Ticket className="w-4.5 h-4.5" aria-hidden="true" />
                    Acheter un billet
                  </motion.button>
                </motion.div>

                {/* Stats */}
                <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {STATS.map((s, i) => (
                    <motion.div
                      key={s.label}
                      custom={i}
                      variants={statsVariants}
                      initial="hidden"
                      animate="visible"
                      className="glass rounded-2xl p-4 text-center"
                    >
                      <div className="text-white font-bold text-2xl md:text-3xl">{s.value}</div>
                      <div className="text-white/60 text-xs mt-1 font-medium">{s.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Images droite */}
              <motion.div
                className="lg:col-span-5 hidden lg:block"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 space-y-3">
                  {/* Image principale */}
                  <div className="overflow-hidden rounded-2xl">
                    <motion.img
                      src={heroImages[0].src}
                      alt={heroImages[0].alt}
                      loading="eager"
                      className="w-full h-52 object-cover"
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  {/* Images secondaires */}
                  <div className="grid grid-cols-2 gap-3">
                    {heroImages.slice(1).map((img, i) => (
                      <div key={i} className="overflow-hidden rounded-2xl">
                        <motion.img
                          src={img.src}
                          alt={img.alt}
                          loading="lazy"
                          className="w-full h-40 object-cover"
                          whileHover={{ scale: 1.04 }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    ))}
                  </div>
                  {/* Badge Premium */}
                  <div className="flex items-center justify-between text-white/70 text-sm px-1">
                    <span className="font-medium">Une expérience EVANA immersive</span>
                    <span className="inline-flex items-center gap-1.5 bg-secondary/20 border border-secondary/30 rounded-full px-3 py-1.5 text-secondary text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" aria-hidden="true" />
                      Premium
                    </span>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────── PRÉSENTATION ────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-900" aria-label="Présentation EVANA">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
            {/* Texte */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                Pourquoi EVANA ?
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                EVANA : votre billet,{' '}
                <span className="gradient-text">votre vibe.</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-8">
                Une plateforme pensée comme un produit SaaS premium : expérience fluide,
                événements soigneusement sélectionnés et achat simplifié — du clic au moment sur scène.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="flex gap-3 items-start p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-primary/50 transition-colors duration-200"
                  >
                    <span className="text-2xl shrink-0">{f.icon}</span>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-sm">{f.title}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-xs mt-1">{f.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="overflow-hidden rounded-3xl">
                <img src="/images/eve/musique.jpg" alt="" className="w-full h-44 object-cover" loading="lazy" />
              </div>
              <div className="overflow-hidden rounded-3xl">
                <img src="/images/eve/event.jpg" alt="" className="w-full h-44 object-cover" loading="lazy" />
              </div>
              
              <div className="overflow-hidden rounded-3xl">
                <img src="/images/eve/concert.jpg" alt="" className="w-full h-44 object-cover" loading="lazy" />
              </div>
              <div className="overflow-hidden rounded-3xl">
                <img src="/images/eve/tech.jpg" alt="" className="w-full h-44 object-cover" loading="lazy" />
              </div>

              {/* CTA card */}
              <div className="col-span-2 rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 p-5 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Prêt pour votre prochaine expérience ?</div>
                  <div className="text-slate-500 dark:text-slate-400 text-sm mt-1">Réservez en quelques secondes.</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/pricing')}
                  className="shrink-0 flex items-center gap-2 bg-secondary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-secondary-dark transition-all duration-200"
                >
                  Voir les offres
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────────────────────────── ÉVÉNEMENTS ────────────────────────── */}
      <section
        id="events"
        className="py-20 bg-slate-50 dark:bg-slate-800/50"
        aria-label="Liste des événements"
      >
        <div className="container mx-auto px-4 lg:px-6">
          {/* En-tête section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider mb-3">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              Programmation
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Événements à venir
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-lg mx-auto">
              Découvrez notre sélection d'événements premium. Festivals, concerts, ateliers — il y en a pour tous les goûts.
            </p>
          </motion.div>

          {/* SearchBar + Filtres */}
          <div className="mb-10">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              category={category}
              onCategoryChange={setCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
              resultsCount={loading ? undefined : filteredEvents.length}
            />
          </div>

          {/* Contenu */}
          {loading ? (
            <EventGridSkeleton count={6} />
          ) : error ? (
            <ErrorState rawError={error} onRetry={loadEvents} />
          ) : filteredEvents.length === 0 ? (
            hasActiveSearch ? (
              <NoSearchResult query={searchQuery} onReset={resetFilters} />
            ) : (
              <NoEvents />
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, i) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onViewDetails={handleViewDetails}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
