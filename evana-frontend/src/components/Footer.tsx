import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin, Send, ArrowRight, Heart } from 'lucide-react';

/*ocial */
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-slate-900 dark:bg-slate-950 text-slate-300"
      aria-label="Pied de page EVANA"
    >
      {/* ── Section principale ── */}
      <div className="container mx-auto px-4 lg:px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* ── Col 1 : EVANA Brand ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 group"
              aria-label="EVANA — Retour à l'accueil"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-origami-icon lucide-origami"><path d="M12 12V4a1 1 0 0 1 1-1h6.297a1 1 0 0 1 .651 1.759l-4.696 4.025"/><path d="m12 21-7.414-7.414A2 2 0 0 1 4 12.172V6.415a1.002 1.002 0 0 1 1.707-.707L20 20.009"/><path d="m12.214 3.381 8.414 14.966a1 1 0 0 1-.167 1.199l-1.168 1.163a1 1 0 0 1-.706.291H6.351a1 1 0 0 1-.625-.219L3.25 18.8a1 1 0 0 1 .631-1.781l4.165.027"/></svg>
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                EVA<span className="text-primary">NA</span>
              </span>
            </button>

            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              La plateforme premium de gestion d'événements — festivals, concerts,
              conférences. Vivez chaque moment intensément.
            </p>

            {/*sociaux */}
            <div className="flex gap-3">
              {[
                { Icon: TwitterIcon, href: '#', label: 'Twitter (X)' },
                { Icon: InstagramIcon, href: '#', label: 'Instagram' },
                { Icon: FacebookIcon, href: '#', label: 'Facebook' },
                { Icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`EVANA sur ${label}`}
                  className="w-9 h-9 rounded-xl bg-slate-800 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-200 hover:scale-105"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Accueil', path: '/' },
                { label: 'Programme', path: '/schedule' },
                { label: 'Artistes', path: '/artists' },
                { label: 'Tarifs', path: '/pricing' },
                { label: 'Billets', path: '/tickets' },
              ].map(({ label, path }) => (
                <li key={path}>
                  <button
                    onClick={() => navigate(path)}
                    className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3 : Informations ── */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Informations
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'À propos', path: '/about' },
                { label: 'FAQ', path: '/about' },
                { label: 'Blog', path: '/about' },
                { label: 'Mentions légales', path: '/about' },
                { label: 'Politique de confidentialité', path: '/about' },
                { label: 'Contact', path: '/contact' },
              ].map(({ label, path }) => (
                <li key={label}>
                  <button
                    onClick={() => navigate(path)}
                    className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/*ontact */}
          <div className="space-y-6">
            {/* Contact */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Contact
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="mailto:evana@gmail.com"
                    className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                    evana@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+2210000000"
                    className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                    +221 78 147 05 71
                  </a>
                </li>
                <li>
                  <span className="flex items-start gap-2.5 text-sm text-slate-400">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    Dakar, Sénégal
                  </span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Newsletter
              </h4>
              <p className="text-xs text-slate-400">
                Recevez les meilleures offres et événements directement dans votre boîte mail.
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-sm text-success font-medium">
                  <span>✓</span>
                  <span>Merci pour votre inscription !</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    aria-label="Adresse email pour la newsletter"
                    className="flex-1 min-w-0 px-3 py-2.5 bg-slate-800 dark:bg-slate-700 border border-slate-700 dark:border-slate-600 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                  />
                  <button
                    type="submit"
                    aria-label="S'abonner à la newsletter"
                    className="shrink-0 w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white hover:bg-primary-light hover:shadow-glow-sm transition-all duration-200"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* bs page */}
      <div className="border-t border-slate-800 dark:border-slate-700">
        <div className="container mx-auto px-4 lg:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {currentYear} EVANA. Tous droits réservés.
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            Fait avec coeur pour les amateurs d'événements
          </p>
          <div className="flex gap-4 text-xs text-slate-500">
            <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
              Mentions légales
            </button>
            <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
              Confidentialité
            </button>
            <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
              FAQ
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;