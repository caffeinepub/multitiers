import { useState, FormEvent, useEffect, useRef } from 'react';
import { Shield, LogOut, UserPlus, CheckCircle, AlertCircle, Lock, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tier, Category } from '../backend';
import { useAddPlayer, useGetAllPlayers } from '../hooks/useQueries';
import { TIER_CONFIG } from './PlayerCard';

const ADMIN_PASSWORD = '65515616151';

const TIERS: { value: Tier; label: string }[] = [
  { value: Tier.HT1, label: 'HT1' },
  { value: Tier.LT1, label: 'LT1' },
  { value: Tier.HT2, label: 'HT2' },
  { value: Tier.LT2, label: 'LT2' },
  { value: Tier.HT3, label: 'HT3' },
  { value: Tier.LT3, label: 'LT3' },
  { value: Tier.HT4, label: 'HT4' },
  { value: Tier.LT4, label: 'LT4' },
  { value: Tier.HT5, label: 'HT5' },
  { value: Tier.LT5, label: 'LT5' },
];

const CATEGORIES: { value: Category; label: string }[] = [
  { value: Category.Sword, label: 'Sword' },
  { value: Category.Axe, label: 'Axe' },
  { value: Category.Crystal, label: 'Crystal' },
  { value: Category.Mace, label: 'Mace' },
  { value: Category.Spearmace, label: 'Spearmace' },
  { value: Category.DiamondSMP, label: 'Diamond SMP' },
  { value: Category.UHC, label: 'UHC' },
  { value: Category.SMP, label: 'SMP' },
];

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function PasswordGate({
  onAuthenticated,
  onClose,
}: {
  onAuthenticated: () => void;
  onClose: () => void;
}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onAuthenticated();
    } else {
      setError('Incorrect password. Access denied.');
      setIsShaking(true);
      setPassword('');
      setTimeout(() => setIsShaking(false), 600);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[340px]">
      <div className={`w-full max-w-sm ${isShaking ? 'animate-shake' : ''}`}>
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-tier-ht1/10 border border-tier-ht1/30 shadow-glow-ht1">
            <Lock className="h-7 w-7 text-tier-ht1" />
          </div>
          <h2 className="text-xl font-black text-app-fg uppercase tracking-wider">Admin Access</h2>
          <p className="text-app-muted text-sm mt-1">
            Enter the admin password to manage players.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="modal-password" className="text-app-fg text-sm font-bold uppercase tracking-wider">
              Password
            </Label>
            <Input
              id="modal-password"
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter admin password"
              className="bg-app-surface border-white/20 text-app-fg placeholder:text-app-muted focus:border-tier-ht1/60 focus:ring-tier-ht1/30 h-11"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-tier-ht1 hover:bg-tier-ht1/90 text-black font-black uppercase tracking-wider h-11"
          >
            <Shield className="mr-2 h-4 w-4" />
            Unlock Admin
          </Button>
        </form>
      </div>
    </div>
  );
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const addPlayer = useAddPlayer();
  const { data: players = [], isLoading: playersLoading } = useGetAllPlayers();

  const [name, setName] = useState('');
  const [tier, setTier] = useState<Tier | ''>('');
  const [category, setCategory] = useState<Category | ''>('');
  const [score, setScore] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [validationError, setValidationError] = useState('');

  function resetForm() {
    setName('');
    setTier('');
    setCategory('');
    setScore('');
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!name.trim()) {
      setValidationError('Player name is required.');
      return;
    }
    if (!tier) {
      setValidationError('Please select a tier.');
      return;
    }
    if (!category) {
      setValidationError('Please select a category.');
      return;
    }
    if (!score.trim() || isNaN(Number(score))) {
      setValidationError('Please enter a valid rating score.');
      return;
    }

    addPlayer.mutate(
      {
        name: name.trim(),
        tier: tier as Tier,
        category: category as Category,
        score: BigInt(Math.round(Number(score))),
      },
      {
        onSuccess: (player) => {
          setSuccessMessage(`"${player.name}" added successfully!`);
          resetForm();
          setTimeout(() => setSuccessMessage(''), 5000);
        },
        onError: (err) => {
          setValidationError(`Failed to add player: ${err.message}`);
        },
      }
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-app-surface/50">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-tier-ht1/10 border border-tier-ht1/30">
            <Shield className="h-4 w-4 text-tier-ht1" />
          </div>
          <div>
            <h2 className="text-base font-black text-app-fg uppercase tracking-wider leading-tight">Admin Panel</h2>
            <p className="text-xs text-app-muted">Manage players and rankings</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="border-white/20 text-app-muted hover:text-app-fg hover:border-white/40 hover:bg-white/5 text-xs font-bold uppercase tracking-wider"
        >
          <LogOut className="mr-1.5 h-3.5 w-3.5" />
          Logout
        </Button>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Add Player Form */}
          <div className="rounded-lg border border-white/10 bg-app-surface/30 p-5">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="h-4 w-4 text-tier-ht1" />
              <h3 className="text-sm font-black text-app-fg uppercase tracking-wider">Add New Player</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="player-name" className="text-app-muted text-xs font-bold uppercase tracking-wider">
                  Player Name
                </Label>
                <Input
                  id="player-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter player name"
                  className="bg-app-bg border-white/15 text-app-fg placeholder:text-app-muted focus:border-tier-ht1/50 h-10"
                  disabled={addPlayer.isPending}
                />
              </div>

              {/* Tier + Category row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-app-muted text-xs font-bold uppercase tracking-wider">Tier</Label>
                  <Select
                    value={tier}
                    onValueChange={(v) => setTier(v as Tier)}
                    disabled={addPlayer.isPending}
                  >
                    <SelectTrigger className="bg-app-bg border-white/15 text-app-fg focus:border-tier-ht1/50 h-10">
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent className="bg-app-surface border-white/15">
                      {TIERS.map((t) => {
                        const cfg = TIER_CONFIG[t.value];
                        return (
                          <SelectItem key={t.value} value={t.value} className="text-app-fg focus:bg-white/10">
                            <span className={`font-black ${cfg.color}`}>{t.label}</span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-app-muted text-xs font-bold uppercase tracking-wider">Category</Label>
                  <Select
                    value={category}
                    onValueChange={(v) => setCategory(v as Category)}
                    disabled={addPlayer.isPending}
                  >
                    <SelectTrigger className="bg-app-bg border-white/15 text-app-fg focus:border-tier-ht1/50 h-10">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-app-surface border-white/15">
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value} className="text-app-fg focus:bg-white/10">
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Score */}
              <div className="space-y-1.5">
                <Label htmlFor="player-score" className="text-app-muted text-xs font-bold uppercase tracking-wider">
                  Rating Score
                </Label>
                <Input
                  id="player-score"
                  type="number"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="e.g. 1500"
                  className="bg-app-bg border-white/15 text-app-fg placeholder:text-app-muted focus:border-tier-ht1/50 h-10"
                  disabled={addPlayer.isPending}
                />
              </div>

              {/* Feedback */}
              {validationError && (
                <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}
              {successMessage && (
                <div className="flex items-center gap-2 rounded-md border border-green-500/40 bg-green-500/10 px-3 py-2.5 text-sm text-green-400">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={addPlayer.isPending}
                className="w-full bg-tier-ht1 hover:bg-tier-ht1/90 text-black font-black uppercase tracking-wider h-10"
              >
                {addPlayer.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Player
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Player List */}
          <div className="rounded-lg border border-white/10 bg-app-surface/30 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-app-surface/50">
              <h3 className="text-sm font-black text-app-fg uppercase tracking-wider">
                All Players
              </h3>
              <span className="text-xs text-app-muted font-bold bg-app-bg px-2 py-0.5 rounded-full border border-white/10">
                {playersLoading ? '…' : players.length}
              </span>
            </div>

            {playersLoading ? (
              <div className="p-4 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 rounded bg-app-surface animate-pulse" />
                ))}
              </div>
            ) : players.length === 0 ? (
              <div className="p-8 text-center text-app-muted">
                <p className="text-sm font-medium">No players added yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {players.map((player) => {
                  const config = TIER_CONFIG[player.tier as Tier];
                  return (
                    <div
                      key={Number(player.id)}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors"
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border flex-shrink-0 ${config.bg} ${config.color}`}>
                        {player.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-app-fg text-sm truncate">{player.name}</span>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${config.bg} ${config.color}`}>
                            {player.tier}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-app-muted text-xs">{player.category}</span>
                          <span className="text-app-muted/40 text-xs">·</span>
                          <span className={`text-xs font-bold ${config.color}`}>
                            {Number(player.score).toLocaleString()} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setAuthenticated(false), 300);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] flex flex-col rounded-xl border border-white/15 bg-app-bg shadow-card overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-md text-app-muted hover:text-app-fg hover:bg-white/10 transition-all"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {authenticated ? (
          <AdminPanel onLogout={() => setAuthenticated(false)} />
        ) : (
          <PasswordGate onAuthenticated={() => setAuthenticated(true)} onClose={onClose} />
        )}
      </div>
    </div>
  );
}
