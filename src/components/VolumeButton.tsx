import React from 'react';
import { ProgressButton } from './ProgressButton';

interface VolumeButtonProps {
  onClick: () => void;
  isLoading: boolean;
  volume?: number;
}

export function VolumeButton({ onClick, isLoading, volume }: VolumeButtonProps) {
  return (
    <ProgressButton
      onClick={onClick}
      isLoading={isLoading}
      duration={3000}
      className={`px-2 py-1 text-xs font-medium rounded ${
        isLoading
          ? 'bg-gray-100 text-gray-400'
          : volume !== undefined
            ? 'bg-green-50 hover:bg-green-100'
            : 'bg-red-50 hover:bg-red-100'
      }`}
    >
      {isLoading ? (
        '...'
      ) : (
        <>
          <span className="text-red-600">VOL</span>
          {volume !== undefined && (
            <span className="text-green-600 ml-1">{volume}</span>
          )}
        </>
      )}
    </ProgressButton>
  );
}