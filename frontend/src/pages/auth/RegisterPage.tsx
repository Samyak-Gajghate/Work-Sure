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

const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(150),
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/\d/, 'Must include a number')
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'Must include a special character'),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

type RegisterForm = z.infer<typeof registerSchema>;

function PasswordStrengthBar({ password }: { password: string }) {
  const getStrength = (pw: string): 0 | 1 | 2 | 3 | 4 => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/\d/.test(pw)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw)) score++;
    return Math.min(score, 4) as 0 | 1 | 2 | 3 | 4;
  };

  const strength = getStrength(password);
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-500'];
  const textColors = ['', 'text-red-500', 'text-orange-500', 'text-yellow-600', 'text-emerald-600'];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300
              ${strength >= i ? colors[strength] : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${textColors[strength]}`}>{labels[strength]}</p>
    </div>
  );
}

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');

  const onSubmit = async (data: RegisterForm) => {
    try {
      setApiError('');
      await authRegister(data.full_name, data.email, data.password);
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
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand rounded-md flex items-center justify-center">
            <CheckSquare className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Work-Sure</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Work moves faster when everyone's aligned.
          </h1>
          <p className="text-white/60 text-lg">The work OS for teams who ship.</p>

          <div className="mt-10 space-y-3">
            {[
              { icon: '✓', text: 'Manage tasks across your entire team' },
              { icon: '✓', text: 'Visual kanban board for team sprints' },
              { icon: '✓', text: 'Role-based access for Admins, Managers & Members' },
              { icon: '✓', text: 'Real-time activity and notifications' },
            ].map((f) => (
              <div key={f.text} className="flex items-start gap-3">
                <span className="text-emerald-400 font-bold shrink-0">{f.icon}</span>
                <p className="text-white/70 text-sm">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-sm">Trusted by 500+ teams worldwide</p>

        <div className="absolute top-1/4 right-0 w-64 h-64 bg-brand/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-[380px]">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 bg-brand rounded-md flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Work-Sure</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
            <p className="text-sm text-gray-500 mt-1">Start managing work in minutes</p>
          </div>

          {apiError && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              <span className="shrink-0">⚠️</span>
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Input
              label="Full Name"
              placeholder="Arjun Sharma"
              autoComplete="name"
              required
              error={errors.full_name?.message}
              {...register('full_name')}
            />

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
              <label className="label" htmlFor="password">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
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
              <PasswordStrengthBar password={password} />
            </div>

            <div className="space-y-1.5">
              <label className="label" htmlFor="confirm_password">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirm_password"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.confirm_password}
                  className={`input-field pr-10 ${errors.confirm_password ? 'input-error' : ''}`}
                  {...register('confirm_password')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-xs text-red-600">{errors.confirm_password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full h-10" isLoading={isSubmitting}>
              {isSubmitting ? 'Creating account...' : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-brand hover:text-brand-hover font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
