export function getPositionColor(position: number): {
  fill: string;
  hover: string;
} {
  if (position <= 10) {
    return {
      fill: 'fill-yellow-400',
      hover: 'group-hover:fill-yellow-500'
    };
  }
  if (position <= 30) {
    return {
      fill: 'fill-green-500',
      hover: 'group-hover:fill-green-600'
    };
  }
  if (position <= 50) {
    return {
      fill: 'fill-blue-500',
      hover: 'group-hover:fill-blue-600'
    };
  }
  return {
    fill: 'fill-gray-500',
    hover: 'group-hover:fill-gray-600'
  };
}