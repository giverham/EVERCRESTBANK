import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { siteConfig } from '../../config/siteConfig';
import { Input } from '../../components/ui/Input';
import { Button, LinkButton } from '../../components/ui/Button';

const schema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type FormData = z.infer<typeof schema>;

export function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin-giver/dashboard';

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
    const result = await login(data, 'admin');
    setLoading(false);
    if (result.success) {
      navigate(from);
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-primary-950">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 order-2 lg:order-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex justify-center lg:hidden">
            <Link to="/" className="flex items-center gap-3">
              <img src={siteConfig.logoUrl} alt={siteConfig.bankName} className="w-10 h-10 rounded-lg" />
              <span className="font-serif font-bold text-xl text-white">{siteConfig.bankName}</span>
            </Link>
          </div>

          <div className="glass-strong rounded-2xl p-8 shadow-premium">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary-900 dark:text-white">Admin Portal</h2>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">Authorized personnel only</p>
              </div>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-error-50 dark:bg-error-500/10 border border-error-200 dark:border-error-500/20">
                <AlertCircle className="w-5 h-5 text-error-600 dark:text-error-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-error-700 dark:text-error-300">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Admin Email"
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

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Authenticating...' : 'Access Admin Portal'} <ArrowRight className="w-5 h-5" />
              </Button>
            </form>


          </div>

          <div className="mt-6 text-center">
            <LinkButton to="/login" variant="ghost" size="sm" className="!text-secondary-600 dark:!text-secondary-400">
              ← Customer Login
            </LinkButton>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden order-1 lg:order-2">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-3 ml-auto">
            <img src={siteConfig.logoUrl} alt={siteConfig.bankName} className="w-10 h-10 rounded-lg" />
            <span className="font-serif font-bold text-xl">{siteConfig.bankName}</span>
          </Link>
          <div>
            <Shield className="w-16 h-16 text-accent-400 mb-6" />
            <h1 className="font-serif text-4xl font-bold mb-4">Administration</h1>
            <p className="text-secondary-200 text-lg leading-relaxed max-w-md">
              Manage customers, accounts, website content, themes, and system settings from a single, secure dashboard.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-secondary-300">
            <Lock className="w-4 h-4" />
            Role-based access control • Audit logging enabled
          </div>
        </div>
      </div>
    </div>
  );
}
