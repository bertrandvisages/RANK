export interface PositionColors {
  text: string;
  fill: string;
  hover: string;
  stroke: string;
}

export function getPositionColors(position: number): PositionColors {
  // Position 1-10 : Jaune
  if (position >= 1 && position <= 10) {
    return {
      text: 'text-yellow-500',
      fill: 'fill-yellow-500',
      hover: 'hover:fill-yellow-600',
      stroke: 'stroke-yellow-500'
    };
  }
  // Position 11-30 : Vert
  if (position >= 11 && position <= 30) {
    return {
      text: 'text-green-500',
      fill: 'fill-green-500',
      hover: 'hover:fill-green-600',
      stroke: 'stroke-green-500'
    };
  }
  // Position 31-50 : Bleu
  if (position >= 31 && position <= 50) {
    return {
      text: 'text-blue-500',
      fill: 'fill-blue-500',
      hover: 'hover:fill-blue-600',
      stroke: 'stroke-blue-500'
    };
  }
  // Position 51-100 : Gris
  return {
    text: 'text-gray-500',
    fill: 'fill-gray-500',
    hover: 'hover:fill-gray-600',
    stroke: 'stroke-gray-500'
  };
}