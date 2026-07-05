import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import Button from '../components/ui/Button';

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Standard Pass',
      price: '15 000',
      description: 'Idéal pour profiter pleinement des concerts et de l\'ambiance générale.',
      features: [
        'Accès aux scènes principales',
        'Placement libre en zone standard',
        'Accès aux food trucks et stands',
        'Support standard',
      ],
      popular: false,
      cta: 'Acheter Standard',
    },
    {
      name: 'VIP Experience',
      price: '45 000',
      description: 'Accès privilégié, confort maximal et rencontres avec les artistes.',
      features: [
        'Accès à toutes les scènes + Zone VIP',
        'Placement prioritaire au premier rang',
        'Cocktail de bienvenue + Open Bar softs',
        'Rencontre exclusive avec les artistes (Meet & Greet)',
        'Accès coupe-file à l\'entrée',
        'Support prioritaire 24/7',
      ],
      popular: true,
      cta: 'Devenir VIP',
    },
    {
      name: 'Platinum Pass',
      price: '90 000',
      description: 'L\'expérience ultime sans compromis avec hébergement inclus.',
      features: [
        'Tous les avantages du pass VIP',
        'Accès aux loges privées des artistes',
        'Hébergement 1 nuit en hôtel partenaire',
        'Navette privée aller-retour festival',
        'Cadeau collector EVANA officiel',
      ],
      popular: false,
      cta: 'Pass Platinum',
    },
  ];

  return (
    <div className="py-16 md:py-24 container mx-auto px-4 lg:px-6 max-w-6xl space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
          Tarifs des <span className="gradient-text">Accès</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Choisissez l'expérience qui vous correspond. Des billets simples aux pass VIP tout-inclus.
        </p>
      </div>

      {/* Grid plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-6">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className={`relative rounded-3xl p-8 flex flex-col justify-between border transition-all duration-300 bg-white dark:bg-slate-800 ${
              plan.popular
                ? 'border-primary shadow-glow ring-2 ring-primary/20 scale-105 z-10'
                : 'border-slate-200 dark:border-slate-700 shadow-soft hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                <Star className="w-3 h-3 fill-white" /> Le plus populaire
              </span>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                <span className="text-sm font-semibold text-slate-400">CFA</span>
              </div>

              <ul className="space-y-3 pt-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? 'text-primary' : 'text-success'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                fullWidth
                onClick={() => navigate('/tickets')}
              >
                {plan.cta}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;