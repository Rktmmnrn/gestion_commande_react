import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading: authLoading, error: authError, isAuthenticated, isAdmin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const usernameRef = useRef<HTMLInputElement>(null);

  const from = (location.state as any)?.from?.pathname || null;

  useEffect(() => {
    if (isAuthenticated) {
      // Si there's a specific 'from' location, go there
      if (from) {
        navigate(from, { replace: true });
      } else {
        // Sinon, rediriger en fonction du rôle
        if (isAdmin) {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/pos', { replace: true });
        }
      }
    }
  }, [isAuthenticated, isAdmin, navigate, from]);

  useEffect(() => {
    if (authError) {
      setLocalError(authError);
      usernameRef.current?.focus();
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!username.trim()) {
      setLocalError('Veuillez entrer votre nom d\'utilisateur');
      usernameRef.current?.focus();
      return;
    }

    if (!password) {
      setLocalError('Veuillez entrer votre mot de passe');
      return;
    }

    try {
      await login({ username: username.trim(), password });
      // Navigation will happen via useEffect
    } catch (err) {
      // Error is already set in context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Entrez vos identifiants pour accéder à votre espace</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {(localError || authError) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{localError || authError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                ref={usernameRef}
                id="username"
                type="text"
                placeholder="Entrez votre nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={authLoading}
                autoComplete="username"
                aria-invalid={!!localError}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={authLoading}
                autoComplete="current-password"
                aria-invalid={!!localError}
              />
            </div>

            <Button type="submit" className="w-full" disabled={authLoading}>
              {authLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => {/* TODO: Implement forgot password */}}
                className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}