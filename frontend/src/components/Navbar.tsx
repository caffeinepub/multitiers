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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-nav-bg backdrop-blur-md">
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
            <span className="text-xl font-black tracking-widest uppercase text-tier-s sr-only">
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
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-bold uppercase tracking-wider transition-all duration-150 ${
                    isActive
                      ? 'bg-tier-s/15 text-tier-s border border-tier-s/30'
                      : 'text-app-muted hover:text-app-fg hover:bg-white/5'
                  }`}
                >
                  <Icon size={15} />
                  {label}
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
                className="w-full bg-white/5 border border-white/10 rounded text-sm text-app-fg placeholder:text-app-muted pl-9 pr-3 py-2 focus:outline-none focus:border-tier-s/50 focus:bg-white/8 transition-all"
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-app-muted hover:text-app-fg p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
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
              className="w-full bg-white/5 border border-white/10 rounded text-sm text-app-fg placeholder:text-app-muted pl-9 pr-3 py-2 focus:outline-none focus:border-tier-s/50 transition-all"
            />
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-3 flex flex-col gap-1">
            {navLinks.map(({ label, path, icon: Icon }) => {
              const isActive = currentPath === path;
              return (
                <button
                  key={path}
                  onClick={() => { navigate({ to: path }); setMobileOpen(false); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-tier-s/15 text-tier-s border border-tier-s/30'
                      : 'text-app-muted hover:text-app-fg hover:bg-white/5'
                  }`}
                >
                  <Icon size={15} />
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
