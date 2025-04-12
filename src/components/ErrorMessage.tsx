import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md">
      <AlertCircle size={20} />
      <p className="text-sm">{message}</p>
    </div>
  );
}