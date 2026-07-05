import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { Avatar } from './ui/Avatar';
import {Zap,CalendarDays,Users,TicketPercent,Ticket,Info,PhoneCall,LayoutDashboard,Settings,LogOut,Moon,Sun,Menu,X,ChevronDown,Home,
} from 'lucide-react';

/* ── Types ── */
interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

/* ── Navigation publique/user ── */
const publicNav: NavItem[] = [
  { label: 'Accueil', path: '/', icon: Home },
  { label: 'Programme', path: '/schedule', icon: CalendarDays },
  { label: 'Artistes', path: '/artists', icon: Users },
  { label: 'Tarifs', path: '/pricing', icon: TicketPercent },
  { label: 'Billets', path: '/tickets', icon: Ticket },
  { label: 'À propos', path: '/about', icon: Info },
  { label: 'Contact', path: '/contact', icon: PhoneCall },
];

/* ── Navigation admin ── */
const adminNav: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Événements', path: '/admin/events', icon: CalendarDays },
];

/* ── Hook scroll ── */
function useScrolled(threshold = 10): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

/* ── princip ── */
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, username, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const scrolled = useScrolled();

  const isAdmin = isAuthenticated && role === 'admin';
  const isUser = isAuthenticated && role === 'user';
  const navItems = isAdmin ? adminNav : publicNav;

  /* Mobile */
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);

  /* User dp */
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Fermeturesur changement de route */
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  /* Fermeture dp au click extérieur */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Empcherscroll quand mobile ouvert */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  /* ── NavLinkstyles ── */
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
      isActive
        ? 'text-primary bg-primary-50 dark:bg-primary-900/30'
        : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800',
    ].join(' ');

  /* ── Rendu ── */
  return (
    <>
      <header
        role="banner"
        className={[
          'sticky top-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-card border-b border-slate-200/60 dark:border-slate-700/60'
            : 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-transparent',
        ].join(' ')}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">

            {/*logo*/}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-primary rounded-xl"
              aria-label="EVANA — Retour à l'accueil"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-glow-sm group-hover:scale-105 transition-transform duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-origami-icon lucide-origami"><path d="M12 12V4a1 1 0 0 1 1-1h6.297a1 1 0 0 1 .651 1.759l-4.696 4.025"/><path d="m12 21-7.414-7.414A2 2 0 0 1 4 12.172V6.415a1.002 1.002 0 0 1 1.707-.707L20 20.009"/><path d="m12.214 3.381 8.414 14.966a1 1 0 0 1-.167 1.199l-1.168 1.163a1 1 0 0 1-.706.291H6.351a1 1 0 0 1-.625-.219L3.25 18.8a1 1 0 0 1 .631-1.781l4.165.027"/></svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                EVA<span className="text-primary">NA</span>
              </span>
            </button>

            {/* ── Navigation Desktop ── */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Navigation principale"
            >
              {navItems.map(({ label, path, icon: Icon }) => (
                <NavLink key={path} to={path} className={navLinkClass} end={path === '/'}>
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* ── Actions droite ── */}
            <div className="flex items-center gap-2">
              {/* Toggle dark mode */}
              <button
                onClick={toggleTheme}
                aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-all duration-200"
              >
                {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>

              {/* Non authentifié */}
              {!isAuthenticated && (
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary rounded-xl transition-all duration-200"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary-light transition-all duration-200 hover:shadow-glow-sm"
                  >
                    Inscription
                  </button>
                </div>
              )}

              {/* Authentifié — Dropdown utilisateur */}
              {isAuthenticated && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((p) => !p)}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                  >
                    <Avatar name={username ?? undefined} size="sm" />
                    <span className="hidden lg:block text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                      {username}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Dropdown menu */}
                  {dropdownOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-modal border border-slate-200 dark:border-slate-700 py-2 animate-slide-down z-60"
                      role="menu"
                    >
                      {/* Header du dropdown */}
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                          {username}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-0.5">
                          {role === 'admin' ? '👑 Administrateur' : '🎫 Membre'}
                        </p>
                      </div>

                      {/* Liens */}
                      <div className="py-1">
                        {isAdmin && (
                          <button
                            onClick={() => navigate('/admin')}
                            role="menuitem"
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-slate-400" aria-hidden="true" />
                            Dashboard Admin
                          </button>
                        )}
                        {isUser && (
                          <button
                            onClick={() => navigate('/user')}
                            role="menuitem"
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-slate-400" aria-hidden="true" />
                            Mon Dashboard
                          </button>
                        )}
                        <button
                          onClick={() => navigate(isAdmin ? '/admin/profile' : '/user/profile')}
                          role="menuitem"
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-slate-400" aria-hidden="true" />
                          Mon profil
                        </button>
                      </div>

                      {/* Déconnexion */}
                      <div className="border-t border-slate-100 dark:border-slate-700 py-1">
                        <button
                          onClick={handleLogout}
                          role="menuitem"
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger-light dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" aria-hidden="true" />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Hamburger mobile */}
              <button
                onClick={() => setMobileOpen((p) => !p)}
                aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={mobileOpen}
                className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu (Drawer) ── */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div
            ref={mobileRef}
            className="fixed top-16 left-0 right-0 z-40 md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-modal animate-slide-down max-h-[calc(100vh-4rem)] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
          >
            <nav className="px-4 py-4 space-y-1" aria-label="Navigation mobile">
              {navItems.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200',
                      isActive
                        ? 'text-primary bg-primary-50 dark:bg-primary-900/30'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
                    ].join(' ')
                  }
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Auth buttons mobile */}
            {!isAuthenticated && (
              <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-3">
                <button
                  onClick={() => { navigate('/login'); setMobileOpen(false); }}
                  className="w-full py-3 text-base font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Connexion
                </button>
                <button
                  onClick={() => { navigate('/register'); setMobileOpen(false); }}
                  className="w-full py-3 text-base font-semibold bg-primary text-white rounded-xl hover:bg-primary-light transition"
                >
                  Inscription
                </button>
              </div>
            )}

            {isAuthenticated && (
              <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar name={username ?? undefined} size="md" />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{username}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {role === 'admin' ? 'Administrateur' : 'Membre'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-danger border border-danger/30 rounded-xl hover:bg-danger-light dark:hover:bg-red-900/20 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;