import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';
import Button from '../components/ui/Button';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulatioenvoi
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  const faqs = [
    { q: "Comment récupérer mon billet après achat ?", a: "Votre billet est instantanément généré sous forme de e-ticket avec QR Code dans votre espace membre (onglet 'Mon Dashboard'). Un email de confirmation vous est également envoyé." },
    { q: "Puis-je annuler ou modifier mon billet ?", a: "Les billets ne sont généralement pas remboursables, sauf en cas d'annulation ou de report majeur de l'événement par l'organisateur." },
    { q: "Quels sont les moyens de paiement acceptés ?", a: "Nous acceptons les cartes bancaires internationales (Visa, Mastercard) ainsi que les principaux services de Mobile Money (Orange Money, Wave, MTN MoMo)." },
  ];

  return (
    <div className="py-16 md:py-24 container mx-auto px-4 lg:px-6 max-w-6xl space-y-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">
          Parlons de votre <span className="gradient-text">Projet</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Une question, un besoin d'assistance ou une proposition ? Notre équipe vous répond sous 24h.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Infos */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-soft">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nos coordonnées</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Email</div>
                  <a href="mailto:support@evana.com" className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary transition">
                    support@evana.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Téléphone</div>
                  <a href="tel:+221330000000" className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary transition">
                    +221 33 000 00 00
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Adresse</div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Avenue Cheikh Anta Diop, Dakar, Sénégal
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* FAQ intégrée */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" /> Questions fréquentes
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 space-y-1">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{faq.q}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulaire de contact (Droite) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Envoyez-nous un message</h3>
            
            {success && (
              <div className="p-4 bg-success-light text-success-dark text-sm rounded-xl font-semibold border border-success/20">
                ✓ Message envoyé avec succès ! Nous vous recontacterons rapidement.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Votre nom
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Bienvenu Grâce"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary transition outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="bienvenu@gmail.com"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary transition outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="subject" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Sujet
              </label>
              <input
                id="subject"
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Demande de partenariat, support..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary transition outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                Votre message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Rédigez votre demande ici..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary transition outline-none resize-none"
              />
            </div>

            <Button
              type="submit"
              isLoading={loading}
              fullWidth
              rightIcon={<Send className="w-4 h-4" />}
            >
              Envoyer le message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;