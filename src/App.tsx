import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { DashboardPage } from './components/DashboardPage';

export default function App() {
  const { user, loading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    if (showSignup) {
      return (
        <div>
          <SignupPage onLoginClick={() => setShowSignup(false)} />
        </div>
      );
    }

    return (
      <div>
        <LoginPage onSignupClick={() => setShowSignup(true)} />
      </div>
    );
  }

  return <DashboardPage />;
}