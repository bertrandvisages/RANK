import React from 'react';
import { X } from 'lucide-react';

interface SerpModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export function SerpModal({ isOpen, onClose, url }: SerpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Résultats de recherche</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <div className="h-[calc(90vh-4rem)] p-4">
          <iframe 
            src={url} 
            className="w-full h-full border-0 rounded"
            title="Résultats de recherche"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
      </div>
    </div>
  );
}