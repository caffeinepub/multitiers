import { useState, useEffect, FormEvent } from 'react';
import { Shield, LogOut, UserPlus, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tier, Category } from '../backend';
import { useAddPlayer } from '../hooks/useQueries';

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

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const addPlayer = useAddPlayer();

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
