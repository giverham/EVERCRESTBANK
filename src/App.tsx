import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
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
import { TransactionsPage } from './pages/customer/TransactionsPage';
import { CardsPage } from './pages/customer/CardsPage';
import { StatementsPage } from './pages/customer/StatementsPage';
import { NotificationsPage } from './pages/customer/NotificationsPage';
import { ProfilePage } from './pages/customer/ProfilePage';
import { SettingsPage } from './pages/customer/SettingsPage';

// Admin dashboard pages
import { AdminDashboardHome } from './pages/admin/AdminDashboardHome';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminCMSPage } from './pages/admin/AdminCMSPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminThemePage } from './pages/admin/AdminThemePage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminPlaceholderPage } from './pages/admin/AdminPlaceholderPage';

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
  { path: '/login', element: <LoginPage /> },
  { path: '/admin-giver', element: <AdminLoginPage /> },
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
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'cards', element: <CardsPage /> },
      { path: 'statements', element: <StatementsPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
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
      { path: 'accounts', element: <AdminPlaceholderPage title="Account Management" /> },
      { path: 'transactions', element: <AdminPlaceholderPage title="Transaction Management" /> },
      { path: 'statements', element: <AdminPlaceholderPage title="Statement Management" /> },
      { path: 'cards', element: <AdminPlaceholderPage title="Card Management" /> },
      { path: 'notifications', element: <AdminPlaceholderPage title="Notification Center" /> },
      { path: 'cms', element: <AdminCMSPage /> },
      { path: 'media', element: <AdminMediaPage /> },
      { path: 'theme', element: <AdminThemePage /> },
      { path: 'reports', element: <AdminPlaceholderPage title="Reports & Analytics" /> },
      { path: 'settings', element: <AdminSettingsPage /> },
      { path: 'audit-logs', element: <AdminPlaceholderPage title="Audit Logs" /> },
      { path: 'roles', element: <AdminPlaceholderPage title="Roles & Permissions" /> },
    ],
  },
  { path: '*', element: <HomePage /> },
]);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}
