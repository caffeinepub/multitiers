import { useNavigate } from '@tanstack/react-router';
import { Search, Trophy, LayoutGrid, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  currentPath: string;
}

const navLinks = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Tier List', path: '/tier-list', icon: LayoutGrid },
  { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
];

export default function Navbar({ searchTerm, onSearchChange, currentPath }: NavbarProps) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-nav-bg backdrop-blur-md shadow-glow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex-shrink-0 flex items-center gap-2 group"
          >
            <img
              src="/assets/generated/multitiers-logo.dim_400x80.png"
              alt="MultiTiers"
              className="h-9 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-xl font-black tracking-widest uppercase text-tier-ht1 sr-only">
              MultiTiers
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, path, icon: Icon }) => {
              const isActive = currentPath === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate({ to: path })}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded text-sm font-bold uppercase tracking-wider transition-all duration-150 ${
                    isActive
                      ? 'text-tier-ht1'
                      : 'text-app-muted hover:text-app-fg hover:bg-white/5'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-tier-ht1 shadow-glow-ht1" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Search */}
          <div className="flex-1 max-w-xs hidden sm:block">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-app-surface border border-white/15 rounded-md text-sm text-app-fg placeholder:text-app-muted pl-9 pr-3 py-2 focus:outline-none focus:border-tier-ht1/60 focus:bg-app-surface2 transition-all"
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-app-muted hover:text-app-fg p-2 rounded transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden pb-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-app-surface border border-white/15 rounded-md text-sm text-app-fg placeholder:text-app-muted pl-9 pr-3 py-2 focus:outline-none focus:border-tier-ht1/60 transition-all"
            />
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-1 border-t border-white/10 pt-3">
            {navLinks.map(({ label, path, icon: Icon }) => {
              const isActive = currentPath === path;
              return (
                <button
                  key={path}
                  onClick={() => { navigate({ to: path }); setMobileOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-tier-ht1/10 text-tier-ht1 border border-tier-ht1/30'
                      : 'text-app-muted hover:text-app-fg hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
