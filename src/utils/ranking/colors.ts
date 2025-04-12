export interface PositionColors {
  text: string;
  fill: string;
  hover: string;
  icon: string;
}

export function getPositionColors(position: number): PositionColors {
  // Entre la position 1 et la position 10 : Jaune
  if (position >= 1 && position <= 10) {
    return {
      text: 'text-yellow-500',
      fill: 'fill-yellow-500',
      hover: 'group-hover:fill-yellow-600',
      icon: 'text-yellow-500'
    };
  }
  // Entre la position 11 et la position 30 : Vert
  if (position >= 11 && position <= 30) {
    return {
      text: 'text-green-500',
      fill: 'fill-green-500',
      hover: 'group-hover:fill-green-600',
      icon: 'text-green-500'
    };
  }
  // Entre la position 31 et la position 50 : Bleu
  if (position >= 31 && position <= 50) {
    return {
      text: 'text-blue-500',
      fill: 'fill-blue-500',
      hover: 'group-hover:fill-blue-600',
      icon: 'text-blue-500'
    };
  }
  // Entre la position 51 et la position 100 : Gris
  if (position >= 51 && position <= 100) {
    return {
      text: 'text-gray-500',
      fill: 'fill-gray-500',
      hover: 'group-hover:fill-gray-600',
      icon: 'text-gray-500'
    };
  }
  // Position par défaut (au cas où)
  return {
    text: 'text-gray-500',
    fill: 'fill-gray-500',
    hover: 'group-hover:fill-gray-600',
    icon: 'text-gray-500'
  };
}