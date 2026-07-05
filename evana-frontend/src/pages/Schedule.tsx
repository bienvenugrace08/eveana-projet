import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Sparkles, User } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  speaker?: string;
  category: 'music' | 'workshop' | 'other' | 'concert' | 'festival';
  location: string;
}

const SCHEDULE_DATA: Record<string, ScheduleItem[]> = {
  Mercredi: [
    {
      id: 'm1',
      time: '17:00 - 19:00',
      title: 'Soirée Cosplay & Pop Culture',
      speaker: 'Présenté par Bilili',
      category: 'other',
      location: 'Scène Annexe',
    },
    {
      id: 'm2',
      time: '19:30 - 22:00',
      title: 'Session Acoustique & Chill',
      speaker: 'Artistes EVANA Collectif',
      category: 'music',
      location: 'Espace Lounge',
    },
  ],
  Jeudi: [
    {
      id: 'j1',
      time: '16:30 - 21:30',
      title: 'Concert en Plein Air',
      speaker: 'Invités Nationaux',
      category: 'concert',
      location: 'Grande Scène Externe',
    },
  ],
  Vendredi: [
    {
      id: 'v1',
      time: '09:30 - 12:30',
      title: 'Sensibilisation à la Cybercriminalité',
      speaker: 'Panel d\'experts IT',
      category: 'workshop',
      location: 'Salle de Conférence A',
    },
    {
      id: 'v2',
      time: '13:00 - 19:00',
      title: 'Tournoi Esport National',
      speaker: 'Animé par MBLLG',
      category: 'other',
      location: 'Arène Digitale',
    },
    {
      id: 'v3',
      time: '20:00 - 23:30',
      title: 'Clôture : Concert Électro',
      speaker: 'DJs EVANA',
      category: 'festival',
      location: 'Main Stage',
    },
  ],
};

const Schedule: React.FC = () => {
  const days = Object.keys(SCHEDULE_DATA);
  const [activeDay, setActiveDay] = useState(days[0]);

  const items = SCHEDULE_DATA[activeDay] || [];

  return (
    <div className="py-16 md:py-24 container mx-auto px-4 lg:px-6 max-w-4xl space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary text-xs font-semibold uppercase tracking-wider"
        >
          <Calendar className="w-3.5 h-3.5" />
          Calendrier des événements
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white"
        >
          Programme <span className="gradient-text">Détaillé</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 dark:text-slate-400 max-w-md mx-auto"
        >
          Planifiez votre parcours parmi nos conférences, ateliers et concerts.
        </motion.p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-slate-200 dark:border-slate-700 pb-px">
        <div className="flex gap-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-6 py-3 text-sm font-bold relative transition duration-200 ${
                activeDay === day ? 'text-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              {activeDay === day && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline items list */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-700 space-y-8 ml-4">
        <AnimatePresence mode="popLayout">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="relative"
            >
              {/* Bullet point */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-slate-900 shadow-soft" />

              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-soft hover:shadow-card transition duration-300 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{item.time}</span>
                  </div>
                  <Badge variant={item.category === 'music' || item.category === 'concert' ? 'primary' : item.category === 'workshop' ? 'success' : 'neutral'} size="sm">
                    {item.category.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  {item.speaker && (
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                      <User className="w-3.5 h-3.5" />
                      <span>{item.speaker}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{item.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Schedule;