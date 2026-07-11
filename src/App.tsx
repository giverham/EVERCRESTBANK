import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CustomerAuthProvider, AdminAuthProvider } from './context/AuthContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { CustomerDashboardLayout } from './components/layout/CustomerDashboardLayout';
import { AdminDashboardLayout } from './components/layout/AdminDashboardLayout';

// Public pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { PersonalBankingPage } from './pages/public/PersonalBankingPage';
import { BusinessBankingPage } from './pages/public/BusinessBankingPage';
import { SavingsPage } from './pages/public/SavingsPage';
import { CheckingPage } from './pages/public/CheckingPage';
import { LoansPage } from './pages/public/LoansPage';
import { CreditCardsPage } from './pages/public/CreditCardsPage';
import { InvestmentsPage } from './pages/public/InvestmentsPage';
import { SecurityPage } from './pages/public/SecurityPage';
import { ContactPage } from './pages/public/ContactPage';
import { FAQPage } from './pages/public/FAQPage';
import { PrivacyPolicyPage } from './pages/public/PrivacyPolicyPage';
import { TermsPage } from './pages/public/TermsPage';
import { OpenAccountPage } from './pages/public/OpenAccountPage';

// Auth pages
import { LoginPage } from './pages/auth/LoginPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';

// Customer dashboard pages
import { DashboardHome } from './pages/customer/DashboardHome';
import { AccountsPage } from './pages/customer/AccountsPage';
import { AccountDetailsPage } from './pages/customer/AccountDetailsPage';
import { TransactionsPage } from './pages/customer/TransactionsPage';
import { CardsPage } from './pages/customer/CardsPage';
import { StatementsPage } from './pages/customer/StatementsPage';
import { ProfilePage } from './pages/customer/ProfilePage';
import { SettingsPage } from './pages/customer/SettingsPage';

// Admin dashboard pages
import { AdminDashboardHome } from './pages/admin/AdminDashboardHome';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminCMSPage } from './pages/admin/AdminCMSPage';
import { AdminSettingsWrapper } from './pages/admin/AdminSettingsWrapper';
import WebsiteSettings from './pages/admin/WebsiteSettings';

function CustomerAuthLayout() {
  return (
    <CustomerAuthProvider>
      <Outlet />
    </CustomerAuthProvider>
  );
}

function AdminAuthLayout() {
  return (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/personal-banking', element: <PersonalBankingPage /> },
      { path: '/business-banking', element: <BusinessBankingPage /> },
      { path: '/savings', element: <SavingsPage /> },
      { path: '/checking', element: <CheckingPage /> },
      { path: '/loans', element: <LoansPage /> },
      { path: '/credit-cards', element: <CreditCardsPage /> },
      { path: '/investments', element: <InvestmentsPage /> },
      { path: '/security', element: <SecurityPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/faq', element: <FAQPage /> },
      { path: '/privacy-policy', element: <PrivacyPolicyPage /> },
      { path: '/terms', element: <TermsPage /> },
      { path: '/open-account', element: <OpenAccountPage /> },
    ],
  },
  {
    element: <CustomerAuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute allowedRole="customer">
            <CustomerDashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardHome /> },
          { path: 'accounts', element: <AccountsPage /> },
          { path: 'accounts/:id', element: <AccountDetailsPage /> },
          { path: 'transactions', element: <TransactionsPage /> },
          { path: 'cards', element: <CardsPage /> },
          { path: 'statements', element: <StatementsPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    element: <AdminAuthLayout />,
    children: [
      { path: '/admin-giver', element: <AdminLoginPage /> },
      {
        path: '/admin-giver/dashboard',
        element: (
          <ProtectedRoute allowedRole="admin">
            <AdminDashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminDashboardHome /> },
          { path: 'customers', element: <AdminCustomersPage /> },
          { path: 'cms', element: <AdminCMSPage /> },
          { path: 'website-settings', element: <WebsiteSettings /> },
          { path: 'settings', element: <AdminSettingsWrapper /> },
        ],
      },
    ],
  },
  { path: '*', element: <HomePage /> },
]);

import { WebsiteProvider } from './context/WebsiteContext';
import { hasSupabaseEnv } from './lib/supabase';
import { AlertCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';

function VercelConfigDiagnostic() {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const supabaseUrl = 'https://njqytvtzmvwuzuybehcp.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qcXl0dnR6bXZ3dXp1eWJlaGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2OTY2NzAsImV4cCI6MjA5OTI3MjY3MH0.srXMT4_yGgSGgijlPPpVEw4nrTBnRFfpXb1jYvDsAj0';

  const copyToClipboard = (text: string, isUrl: boolean) => {
    navigator.clipboard.writeText(text);
    if (isUrl) {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-primary-950 text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full bg-primary-900/40 backdrop-blur-xl border border-primary-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -ml-20 -mb-20" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-accent-500/20 border border-accent-500/40 rounded-2xl flex items-center justify-center text-accent-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-white tracking-tight">Evercrest Bank</h1>
              <p className="text-[10px] text-accent-400 uppercase tracking-wider font-semibold">Environment Configuration Assistant</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-3">Vercel Deployment Check</h2>
          <p className="text-secondary-300 text-sm mb-6 leading-relaxed">
            It looks like this Vercel project's **Environment Variables** are not yet configured. Please add the following credentials to your Vercel project settings to connect the premium banking interface with your Supabase secure database.
          </p>

          <div className="space-y-4 mb-8">
            <div className="bg-primary-950/80 border border-primary-800 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs font-semibold text-accent-400">VITE_SUPABASE_URL</span>
                <button
                  onClick={() => copyToClipboard(supabaseUrl, true)}
                  className="flex items-center gap-1.5 text-xs text-secondary-400 hover:text-white transition-colors bg-primary-900/50 hover:bg-primary-800 px-2.5 py-1.5 rounded-lg border border-primary-800"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="font-mono text-xs text-secondary-300 select-all break-all bg-primary-900/20 p-2.5 rounded-lg border border-primary-800/50">
                {supabaseUrl}
              </div>
            </div>

            <div className="bg-primary-950/80 border border-primary-800 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs font-semibold text-accent-400">VITE_SUPABASE_ANON_KEY</span>
                <button
                  onClick={() => copyToClipboard(supabaseAnonKey, false)}
                  className="flex items-center gap-1.5 text-xs text-secondary-400 hover:text-white transition-colors bg-primary-900/50 hover:bg-primary-800 px-2.5 py-1.5 rounded-lg border border-primary-800"
                >
                  {copiedKey ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="font-mono text-xs text-secondary-300 select-all break-all bg-primary-900/20 p-2.5 rounded-lg border border-primary-800/50 max-h-24 overflow-y-auto">
                {supabaseAnonKey}
              </div>
            </div>
          </div>

          <div className="border-t border-primary-800 pt-6">
            <h3 className="text-sm font-bold text-white mb-2">How to add these on Vercel:</h3>
            <ol className="list-decimal list-inside text-xs text-secondary-300 space-y-2 mb-6 leading-relaxed">
              <li>Open your project dashboard on Vercel.</li>
              <li>Go to **Settings** &rarr; **Environment Variables**.</li>
              <li>Add the two variables above for all environments (**Production**, **Preview**, **Development**).</li>
              <li>Click **Deployments**, select your latest build, click the three dots, and click **Redeploy**.</li>
            </ol>

            <a
              href="https://vercel.com/giver-tech/evercrestbank/settings/environment-variables"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm bg-accent-500 hover:bg-accent-600 active:bg-accent-700 text-white font-semibold px-6 py-3 rounded-xl shadow-premium hover:shadow-premium-hover transition-all w-full justify-center"
            >
              <span>Go to Vercel Environment Settings</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  if (!hasSupabaseEnv) {
    return <VercelConfigDiagnostic />;
  }

  return (
    <ThemeProvider>
      <WebsiteProvider>
        <RouterProvider router={router} />
      </WebsiteProvider>
    </ThemeProvider>
  );
}

