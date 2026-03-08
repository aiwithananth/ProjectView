import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (!loading && user) navigate(from, { replace: true });
  }, [user, loading, navigate, from]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--page-bg))' }}>
        <div className="text-center" style={{ color: 'hsl(var(--muted-foreground))' }}>
          <div className="inline-block w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Login failed';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'hsl(var(--page-bg))' }}
    >
      <div
        className="w-full max-w-md rounded-xl border shadow-lg p-8"
        style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold" style={{ color: 'hsl(var(--primary))' }}>
            TaskTracker
          </h1>
          <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              className="text-sm px-3 py-2 rounded-md"
              style={{ backgroundColor: 'hsl(var(--destructive) / 0.15)', color: 'hsl(var(--destructive))' }}
            >
              {error}
            </div>
          )}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="text-xs mt-6 text-center" style={{ color: 'hsl(var(--muted-foreground))' }}>
          After seeding, use e.g. alice@example.com / password123
        </p>
        <p className="text-xs mt-4 text-center" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Designed and developed by Anantharaman Krishnamoorthy (Ananth).{' '}
          <a href="mailto:aiwithananth@gmail.com" className="underline hover:opacity-80" style={{ color: 'hsl(var(--primary))' }}>aiwithananth@gmail.com</a>
          . MIT License.
        </p>
      </div>
    </div>
  );
}
