import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';

interface AdminPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminPasswordModal({ open, onClose }: AdminPasswordModalProps) {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus auto sur le champ dès l'ouverture
  useEffect(() => {
    if (open) {
      setPassword('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Veuillez entrer le mot de passe.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(password);
      onClose();
      navigate('/admin/dashboard');
    } catch {
      setError('Mot de passe incorrect.');
      setPassword('');
      inputRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
              <Lock className="w-4 h-4 text-amber-600" />
            </div>
            <DialogTitle className="text-lg">Espace administration</DialogTitle>
          </div>
          <DialogDescription>
            Entrez le mot de passe administrateur pour accéder à la gestion.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="relative">
            <Input
              ref={inputRef}
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              disabled={isLoading}
              className={`pr-10 ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword
                ? <EyeOff className="w-4 h-4" />
                : <Eye className="w-4 h-4" />
              }
            </button>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold"
              disabled={isLoading || !password.trim()}
            >
              {isLoading
                ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Vérification...</>
                : 'Confirmer'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}