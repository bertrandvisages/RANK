import React, { useState, useEffect } from 'react';

interface ProgressButtonProps {
  onClick: () => void;
  isLoading: boolean;
  duration?: number;
  children: React.ReactNode;
  className?: string;
}

export function ProgressButton({
  onClick,
  isLoading,
  duration = 8000,
  children,
  className = ''
}: ProgressButtonProps) {
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      setProgress(0);
      // Delay progress bar start by 500ms to account for webhook call
      timeoutId = setTimeout(() => {
        setShowProgress(true);
        const startTime = Date.now();
        
        const updateProgress = () => {
          const elapsed = Date.now() - startTime;
          const newProgress = Math.min((elapsed / duration) * 100, 100);
          
          if (newProgress < 100 && isLoading) {
            setProgress(newProgress);
            requestAnimationFrame(updateProgress);
          }
        };

        requestAnimationFrame(updateProgress);
      }, 500);
    } else {
      setProgress(0);
      setShowProgress(false);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isLoading, duration]);

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`relative overflow-hidden ${className}`}
    >
      {showProgress && (
        <div 
          className="absolute left-0 top-0 bottom-0 bg-white/20"
          style={{ 
            width: `${progress}%`, 
            transition: 'width 100ms linear'
          }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </button>
  );
}