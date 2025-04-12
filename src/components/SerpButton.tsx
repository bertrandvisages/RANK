import React from 'react';

interface SerpButtonProps {
  url: string;
}

export function SerpButton({ url }: SerpButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="p-1 text-blue-500 hover:text-blue-600 group"
      title="Voir les résultats de recherche"
    >
      <span className="text-[10px] uppercase border border-current rounded px-1 leading-[14px] group-hover:bg-blue-50">
        serp
      </span>
    </a>
  );
}