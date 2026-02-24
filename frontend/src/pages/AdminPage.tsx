import { useState, useEffect, useRef, FormEvent } from 'react';
import {
  Shield, LogOut, UserPlus, CheckCircle, AlertCircle, Lock,
  Copy, Check, Link2, Trash2, Users, RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tier, Category } from '../backend';
import { useAddPlayer, useRemovePlayer, useGetAllPlayers } from '../hooks/useQueries';

const ADMIN_PASSWORD = '65515616151';
const SESSION_KEY = 'admin_authenticated';

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

function getMcAvatarUrl(username: string) {
  return `https://mc-heads.net/avatar/${encodeURIComponent(username)}/64`;
}

function PasswordGate({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      onAuthenticated();
    } else {
      setError('Incorrect password. Access denied.');
      setIsShaking(true);
      setPassword('');
      setTimeout(() => setIsShaking(false), 600);
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <Card className={`w-full max-w-md border-border bg-card shadow-2xl ${isShaking ? 'animate-shake' : ''}`}>
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-tier-ht1/10 border border-tier-ht1/30">
            <Lock className="h-8 w-8 text-tier-ht1" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Admin Access</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter the admin password to access the management area.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter admin password"
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-tier-ht1 focus:ring-tier-ht1"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-tier-ht1 hover:bg-tier-ht1/90 text-white font-semibold"
            >
              <Shield className="mr-2 h-4 w-4" />
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminUrlCard() {
  const [copied, setCopied] = useState(false);
  const adminUrl = `${window.location.origin}/admin`;

  function handleCopy() {
    navigator.clipboard.writeText(adminUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Card className="border-border bg-card shadow-lg mt-6">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-tier-ht1" />
          <CardTitle className="text-lg text-foreground">Admin URL</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          Share or bookmark this link to access the admin panel directly.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground overflow-x-auto whitespace-nowrap select-all">
            {adminUrl}
          </div>
          <Button
            type="button"
            onClick={handleCopy}
            size="sm"
            className={`shrink-0 transition-all ${
              copied
                ? 'bg-green-600 hover:bg-green-600 text-white'
                : 'bg-tier-ht1 hover:bg-tier-ht1/90 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="mr-1.5 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-1.5 h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PlayerListCard() {
  const { data: players, isLoading, refetch } = useGetAllPlayers();
  const removePlayer = useRemovePlayer();
  const [removingId, setRemovingId] = useState<bigint | null>(null);

  function handleRemove(playerId: bigint, playerName: string) {
    if (!confirm(`Remove "${playerName}" from the tier list?`)) return;
    setRemovingId(playerId);
    removePlayer.mutate(playerId, {
      onSettled: () => setRemovingId(null),
    });
  }

  return (
    <Card className="border-border bg-card shadow-lg mt-6">
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-tier-ht1" />
            <CardTitle className="text-lg text-foreground">Current Players</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {players && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {players.length} player{players.length !== 1 ? 's' : ''}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refetch()}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              title="Refresh"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <CardDescription className="text-muted-foreground">
          Remove players from the tier list using the delete button.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 px-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent inline-block" />
            Loading players...
          </div>
        ) : !players || players.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm gap-2">
            <Users className="h-8 w-8 opacity-30" />
            <span>No players added yet.</span>
          </div>
        ) : (
          <ScrollArea className="h-72">
            <ul className="divide-y divide-border">
              {players.map((player) => (
                <li
                  key={String(player.id)}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors"
                >
                  {/* Avatar */}
                  {player.avatarUrl ? (
                    <img
                      src={player.avatarUrl}
                      alt={player.name}
                      className="w-9 h-9 rounded-md object-cover border border-border flex-shrink-0"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-md bg-muted border border-border flex items-center justify-center text-sm font-black text-muted-foreground flex-shrink-0">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{player.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {player.tier} · {player.category} · {Number(player.score).toLocaleString()}
                    </p>
                  </div>
                  {/* Remove button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={removingId === player.id}
                    onClick={() => handleRemove(player.id, player.name)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0 transition-colors"
                    title={`Remove ${player.name}`}
                  >
                    {removingId === player.id ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent inline-block" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const addPlayer = useAddPlayer();

  const [mcUsername, setMcUsername] = useState('');
  const [name, setName] = useState('');
  const [tier, setTier] = useState<Tier | ''>('');
  const [category, setCategory] = useState<Category | ''>('');
  const [score, setScore] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [validationError, setValidationError] = useState('');

  // Skin preview state
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // When mcUsername changes, debounce and update preview
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setAvatarError(false);

    if (!mcUsername.trim()) {
      setAvatarPreviewUrl(null);
      return;
    }

    debounceRef.current = setTimeout(() => {
      setAvatarPreviewUrl(getMcAvatarUrl(mcUsername.trim()));
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [mcUsername]);

  function resetForm() {
    setMcUsername('');
    setName('');
    setTier('');
    setCategory('');
    setScore('');
    setAvatarPreviewUrl(null);
    setAvatarError(false);
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

    const resolvedAvatarUrl =
      mcUsername.trim() && !avatarError
        ? getMcAvatarUrl(mcUsername.trim())
        : null;

    addPlayer.mutate(
      {
        name: name.trim(),
        tier: tier as Tier,
        category: category as Category,
        score: BigInt(Math.round(Number(score))),
        avatarUrl: resolvedAvatarUrl,
      },
      {
        onSuccess: (player) => {
          setSuccessMessage(`Player "${player.name}" has been added successfully!`);
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
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tier-ht1/10 border border-tier-ht1/30">
            <Shield className="h-5 w-5 text-tier-ht1" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage players and rankings</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="border-border text-muted-foreground hover:text-foreground hover:border-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Add Player Card */}
      <Card className="border-border bg-card shadow-lg">
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-tier-ht1" />
            <CardTitle className="text-lg text-foreground">Add New Player</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Fill in the details below to add a new player to the tier list.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Minecraft Username + Skin Preview */}
            <div className="space-y-2">
              <Label htmlFor="mcUsername" className="text-foreground font-medium">
                Minecraft Username
                <span className="ml-1.5 text-xs text-muted-foreground font-normal">(for skin avatar)</span>
              </Label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    id="mcUsername"
                    type="text"
                    value={mcUsername}
                    onChange={(e) => setMcUsername(e.target.value)}
                    placeholder="e.g. Notch"
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-tier-ht1"
                  />
                </div>
                {/* Skin preview */}
                <div className="w-12 h-12 rounded-lg border-2 border-border bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                  {avatarPreviewUrl && !avatarError ? (
                    <img
                      src={avatarPreviewUrl}
                      alt="Minecraft skin preview"
                      className="w-full h-full object-cover"
                      onError={() => setAvatarError(true)}
                      onLoad={() => setAvatarError(false)}
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground text-center leading-tight px-1">
                      {avatarError ? '?' : 'skin'}
                    </span>
                  )}
                </div>
              </div>
              {avatarError && mcUsername.trim() && (
                <p className="text-xs text-amber-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Could not load skin for "{mcUsername}". Player will be added without an avatar.
                </p>
              )}
            </div>

            {/* Player Name */}
            <div className="space-y-2">
              <Label htmlFor="playerName" className="text-foreground font-medium">
                Player Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="playerName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter player name"
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-tier-ht1"
              />
            </div>

            {/* Tier */}
            <div className="space-y-2">
              <Label htmlFor="tier" className="text-foreground font-medium">
                Tier <span className="text-destructive">*</span>
              </Label>
              <Select value={tier} onValueChange={(v) => setTier(v as Tier)}>
                <SelectTrigger className="bg-background border-border text-foreground focus:border-tier-ht1">
                  <SelectValue placeholder="Select a tier" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {TIERS.map((t) => (
                    <SelectItem
                      key={t.value}
                      value={t.value}
                      className="text-foreground hover:bg-muted focus:bg-muted"
                    >
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground font-medium">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger className="bg-background border-border text-foreground focus:border-tier-ht1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {CATEGORIES.map((c) => (
                    <SelectItem
                      key={c.value}
                      value={c.value}
                      className="text-foreground hover:bg-muted focus:bg-muted"
                    >
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rating Score */}
            <div className="space-y-2">
              <Label htmlFor="score" className="text-foreground font-medium">
                Rating Score <span className="text-destructive">*</span>
              </Label>
              <Input
                id="score"
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="e.g. 1500"
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-tier-ht1"
              />
            </div>

            {/* Validation Error */}
            {validationError && (
              <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="flex items-center gap-2 rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-400">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={addPlayer.isPending}
              className="w-full bg-tier-ht1 hover:bg-tier-ht1/90 text-white font-semibold"
            >
              {addPlayer.isPending ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent inline-block" />
                  Adding Player...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Player
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Current Players List */}
      <PlayerListCard />

      {/* Admin URL Card */}
      <AdminUrlCard />
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  function handleAuthenticated() {
    setIsAuthenticated(true);
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return <PasswordGate onAuthenticated={handleAuthenticated} />;
  }

  return <AdminPanel onLogout={handleLogout} />;
}
