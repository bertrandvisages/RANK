import React, { useState, useEffect } from 'react';
import { Share } from 'lucide-react';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Détecter si c'est un iPhone et si l'app n'est pas déjà installée
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setShowPrompt(isIOS && !isStandalone);
  }, []);

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start gap-3">
        <Share className="flex-shrink-0 w-6 h-6 text-blue-500" />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">Installer l'application</h3>
          <p className="mt-1 text-sm text-gray-600">
            Pour installer l'application sur votre iPhone :
          </p>
          <ol className="mt-2 text-sm text-gray-600 list-decimal list-inside space-y-1">
            <li>Appuyez sur le bouton Partager</li>
            <li>Sélectionnez "Sur l'écran d'accueil"</li>
            <li>Appuyez sur "Ajouter"</li>
          </ol>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Fermer</span>
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}