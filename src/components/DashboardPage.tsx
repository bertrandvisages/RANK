import React, { useState } from 'react';
import { DomainList } from './DomainList';
import { KeywordList } from './KeywordList';
import { LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useDomains } from '../hooks/useDomains';
import { useKeywords } from '../hooks/useKeywords';
import { Logo } from './Logo';
import { ErrorMessage } from './ErrorMessage';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);

  const { 
    domains, 
    loading: domainsLoading,
    error: domainsError,
    retry: retryLoadingDomains,
    addDomain,
    deleteDomain
  } = useDomains(user?.id || '');

  const { 
    keywords, 
    loading: keywordsLoading, 
    addKeyword,
    deleteKeyword,
    refreshRanking
  } = useKeywords(user?.id || '', selectedDomainId);

  const handleLogout = async () => {
    await logout();
  };

  if (!user) return null;

  if (domainsError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
          <ErrorMessage message={domainsError} />
          <button
            onClick={retryLoadingDomains}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (domainsLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Logo />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Domains Section - Always visible */}
          <DomainList
            domains={domains}
            onAddDomain={addDomain}
            onDeleteDomain={deleteDomain}
            selectedDomainId={selectedDomainId}
            onSelectDomain={setSelectedDomainId}
          />

          {/* Keywords Section */}
          <KeywordList
            keywords={keywords}
            onAddKeyword={addKeyword}
            onDeleteKeyword={deleteKeyword}
            onRefreshRanking={refreshRanking}
            selectedDomainId={selectedDomainId}
            userId={user.id}
          />
        </div>
      </main>
    </div>
  );
}