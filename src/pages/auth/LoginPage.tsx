import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { siteConfig } from '../../config/siteConfig';
import { Input } from '../../components/ui/Input';
import { Button, LinkButton } from '../../components/ui/Button';

const schema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    setLoading(true);
    const result = await login(data, 'customer');
    setLoading(false);
    if (result.success) {
      navigate(from);
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-3">
            <img src={siteConfig.logoUrl} alt={siteConfig.bankName} className="w-10 h-10 rounded-lg" />
            <span className="font-serif font-bold text-xl">{siteConfig.bankName}</span>
          </Link>
          <div>
            <ShieldCheck className="w-16 h-16 text-accent-400 mb-6" />
            <h1 className="font-serif text-4xl font-bold mb-4">Welcome Back</h1>
            <p className="text-secondary-200 text-lg leading-relaxed max-w-md">
              Secure access to your accounts, cards, and financial tools. Your money, always at your fingertips.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary-300">
            <Lock className="w-4 h-4" />
            Protected by 256-bit encryption
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-secondary-50 dark:bg-secondary-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8 flex justify-center">
            <Link to="/" className="flex items-center gap-3">
              <img src={siteConfig.logoUrl} alt={siteConfig.bankName} className="w-10 h-10 rounded-lg" />
              <span className="font-serif font-bold text-xl text-primary-900 dark:text-white">{siteConfig.bankName}</span>
            </Link>
          </div>

          <h2 className="font-serif text-3xl font-bold text-primary-900 dark:text-white mb-2">Customer Login</h2>
          <p className="text-secondary-500 dark:text-secondary-400 mb-8">Sign in to your account securely.</p>

          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-error-50 dark:bg-error-500/10 border border-error-200 dark:border-error-500/20">
              <AlertCircle className="w-5 h-5 text-error-600 dark:text-error-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error-700 dark:text-error-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              icon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                icon={<Lock className="w-5 h-5" />}
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-secondary-400 hover:text-secondary-600"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                <input type="checkbox" className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500" />
                Remember me
              </label>
              <Link to="/contact" className="text-sm text-accent-600 dark:text-accent-400 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-secondary-500 dark:text-secondary-400">
            Don't have an account?{' '}
            <Link to="/contact" className="text-accent-600 dark:text-accent-400 font-semibold hover:underline">
              Contact us
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
