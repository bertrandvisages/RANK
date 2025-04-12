import React from 'react';
import { Search } from 'lucide-react';
import { ProgressButton } from './ProgressButton';

interface RankingButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export function RankingButton({ onClick, isLoading }: RankingButtonProps) {
  return (
    <ProgressButton
      onClick={onClick}
      isLoading={isLoading}
      duration={8000}
      className="w-full mt-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
    >
      <div className="flex items-center justify-center gap-2 px-4 py-3">
        <Search size={20} className={isLoading ? 'animate-pulse' : ''} />
        <span>{isLoading ? 'Vérification en cours...' : 'Vérifier le classement'}</span>
      </div>
    </ProgressButton>
  );
}