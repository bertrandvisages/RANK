import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Domain } from '../types';
import { validateDomainUrl } from '../utils/domain';
import { MetricsButton } from './MetricsButton';
import { useMetrics } from '../hooks/useMetrics';

interface DomainListProps {
  domains: Domain[];
  onAddDomain: (name: string, url: string) => void;
  onDeleteDomain: (id: string) => void;
  selectedDomainId: string | null;
  onSelectDomain: (id: string) => void;
}

export function DomainList({
  domains,
  onAddDomain,
  onDeleteDomain,
  selectedDomainId,
  onSelectDomain
}: DomainListProps) {
  const [newDomain, setNewDomain] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { loadingDomains, checkDomainMetrics } = useMetrics();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const domain = newDomain.trim().toLowerCase();
    
    if (!domain) {
      setError('Veuillez entrer un nom de domaine');
      return;
    }

    if (!validateDomainUrl(domain)) {
      setError('Format invalide. Utilisez le format: exemple.fr');
      return;
    }

    onAddDomain(domain, domain);
    setNewDomain('');
    setError(null);
  };

  const handleDelete = (e: React.MouseEvent | React.TouchEvent, domainId: string) => {
    e.stopPropagation();
    e.preventDefault();
    onDeleteDomain(domainId);
  };

  const handleDomainSelect = (e: React.MouseEvent | React.TouchEvent, domainId: string) => {
    e.preventDefault();
    onSelectDomain(domainId);
  };

  const handleMetricsCheck = async (e: React.MouseEvent | React.TouchEvent, domain: Domain) => {
    e.stopPropagation();
    e.preventDefault();
    
    try {
      const updatedDomain = await checkDomainMetrics(domain.id, domain.url);
      // Mettre à jour le domaine dans la liste avec les nouvelles valeurs
      if (updatedDomain) {
        const index = domains.findIndex(d => d.id === domain.id);
        if (index !== -1) {
          domains[index] = {
            ...domains[index],
            backlinks: updatedDomain.backlinks,
            rank: updatedDomain.rank
          };
        }
      }
    } catch (error) {
      console.error('Error checking metrics:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
          <h2 className="text-lg font-semibold">Domaines</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={newDomain}
              onChange={(e) => {
                setNewDomain(e.target.value);
                setError(null);
              }}
              placeholder="domaine.fr"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 whitespace-nowrap"
          >
            <Plus size={16} />
            Ajouter
          </button>
        </form>
      </div>

      <div className="space-y-2">
        {domains.map((domain) => {
          const isLoading = loadingDomains.has(domain.id);

          return (
            <div
              key={domain.id}
              onClick={(e) => handleDomainSelect(e, domain.id)}
              onTouchStart={(e) => handleDomainSelect(e, domain.id)}
              className={`group flex items-center justify-between px-3 py-2 rounded-md transition-colors cursor-pointer touch-manipulation ${
                selectedDomainId === domain.id 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span className="font-medium">{domain.name}</span>
              <div className="flex items-center gap-2">
                <MetricsButton
                  onClick={(e) => handleMetricsCheck(e, domain)}
                  isLoading={isLoading}
                  metrics={{
                    backlinks: domain.backlinks,
                    rank: domain.rank
                  }}
                  type="domain"
                />
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, domain.id)}
                  onTouchStart={(e) => handleDelete(e, domain.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}