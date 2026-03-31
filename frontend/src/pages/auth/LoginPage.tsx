import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckSquare, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { extractErrorMessage } from '../../utils/errors';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
type LoginForm = z.infer<typeof loginSchema>;

// Decorative task cards for brand panel
function DecorativeCard({ title, status, priority, rotate }: {
  title: string; status: string; priority: string; rotate: string;
}) {
  return (
    <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 w-56 ${rotate}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xs font-semibold uppercase tracking-wider text-white/60">{priority}</span>
        <span className="text-2xs bg-white/20 text-white/80 px-2 py-0.5 rounded-full">{status}</span>
      </div>
      <p className="text-white text-sm font-medium leading-snug">{title}</p>
    </div>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setApiError('');
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setApiError(extractErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Brand Panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[55%] p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1d23 0%, #2d1b69 60%, #1a1d23 100%)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand rounded-md flex items-center justify-center">
            <CheckSquare className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Work-Sure</span>
        </div>

        {/* Headline */}
        <div className="max-w-md">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Work moves faster when everyone's aligned.
          </h1>
          <p className="text-white/60 text-lg">
            The work OS for teams who ship.
          </p>

          {/* Decorative cards */}
          <div className="mt-12 relative h-48">
            <div className="absolute top-0 left-8 rotate-[-4deg]">
              <DecorativeCard title="Deploy API to production" status="In Review" priority="🔴 Critical" rotate="" />
            </div>
            <div className="absolute top-8 left-20 rotate-[2deg]">
              <DecorativeCard title="Write unit tests for auth" status="In Progress" priority="🟠 High" rotate="" />
            </div>
            <div className="absolute top-16 left-12 rotate-[-1deg]">
              <DecorativeCard title="Update API documentation" status="To Do" priority="🔵 Medium" rotate="" />
            </div>
          </div>
        </div>

        {/* Trust line */}
        <div>
          <p className="text-white/40 text-sm">Trusted by 500+ teams worldwide</p>
          <div className="flex items-center gap-3 mt-3">
            {['Acme Corp', 'ShipFast', 'Buildco', 'Launchpad'].map((name) => (
              <span key={name} className="text-white/30 text-xs font-medium">{name}</span>
            ))}
          </div>
        </div>

        {/* Decorative blur circles */}
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-brand/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 bg-brand rounded-md flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Work-Sure</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-500 mt-1">Sign in to your workspace</p>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              <span className="shrink-0">⚠️</span>
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="label" htmlFor="password">Password</label>
                <button type="button" className="text-xs text-brand hover:text-brand-hover font-medium transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  className={`input-field pr-10 ${errors.password ? 'input-error' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full h-10"
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/auth/register" className="text-brand hover:text-brand-hover font-semibold transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
