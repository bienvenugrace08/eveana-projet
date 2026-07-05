import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Heart, Shield, Users, ArrowRight } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { value: '2026', label: 'Année de création' },
    { value: '+50K', label: 'Festivaliers satisfaits' },
    { value: '+250', label: 'Événements propulsés' },
    { value: '99.9%', label: 'Disponibilité du service' },
  ];

  const team = [
    {
      name: 'Kande Hawa',
      role: 'Directrice Artistique',
      image: '/images/team/awa.jpg',
      bio: 'Passionnée par la culture et les expériences immersives.',
    },
    {
      name: 'Mouhamed Diallo',
      role: 'Directeur Technique',
      image: '/images/team/diallo.png',
      bio: 'Garant de la fluidité, de l\'accessibilité et de la sécurité d\'EVANA.',
    },
    {
      name: 'Awa Sow',
      role: 'Responsable Expérience Client',
      image: '/images/team/sow.jpg',
      bio: 'Dédiée à la satisfaction de chaque festivalier.',
    },
    {
      name: 'Bienvenu SEHOLO',
      role: 'Fondateur et visionnaire',
      image: '/images/team/1.jpg',
      bio: 'manager client',
    }
  ];

  const values = [
    {
      icon: <Sparkles className="w-6 h-6 text-primary" />,
      title: 'Passion & Innovation',
      desc: 'Nous créons des ponts technologiques pour rendre l\'art et la culture accessibles à tous.',
    },
    {
      icon: <Shield className="w-6 h-6 text-secondary" />,
      title: 'Confiance & Sécurité',
      desc: 'Vos transactions et données personnelles sont protégées par des standards stricts.',
    },
    {
      icon: <Users className="w-6 h-6 text-success" />,
      title: 'Inclusivité',
      desc: 'Chaque événement sur EVANA est conçu pour rassembler et célébrer la diversité.',
    },
  ];

  return (
    <div className="py-16 md:py-24 space-y-20">
      {/* ──Intro ── */}
      <section className="container mx-auto px-4 lg:px-6 max-w-5xl text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary text-xs font-semibold uppercase tracking-wider"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Découvrez notre histoire
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight"
        >
          Rapprocher les cœurs à travers{' '}
          <span className="gradient-text">les événements</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed"
        >
          EVANA est née de la volonté de simplifier, moderniser et sécuriser l'accès à la culture. 
          Que vous soyez organisateur de festivals ou passionné de musique, nous vous fournissons 
          les outils pour que chaque moment reste inoubliable.
        </motion.p>
      </section>

      {/* ── Stats Section ── */}
      <section className="bg-slate-100 dark:bg-slate-800/40 py-16">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-soft"
              >
                <div className="text-3xl md:text-4xl font-extrabold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nos Valeurs ── */}
      <section className="container mx-auto px-4 lg:px-6 max-w-6xl space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Nos Engagements</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Ce qui nous pousse à nous dépasser chaque jour.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-4 hover:border-primary/50 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                {v.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{v.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── L'Équipe ── */}
      <section className="container mx-auto px-4 lg:px-6 max-w-6xl space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">L'Équipe EVANA</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Des passionnés à votre service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-soft group"
            >
              <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-750">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h4 className="text-lg font-bold text-white">{member.name}</h4>
                  <p className="text-xs text-white/80 font-medium">{member.role}</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;