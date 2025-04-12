export const DEFAULT_CHART_CONFIG = {
  width: 600,
  height: 200,
  padding: 40,
  tickCount: 5,
  pointRadius: 16
} as const;

export const CHART_CLASSES = {
  line: 'stroke-indigo-500 stroke-2 fill-none',
  point: 'fill-blue-500 cursor-pointer hover:fill-blue-600 transition-colors',
  pointText: 'fill-white text-[10px] font-medium select-none',
  tooltip: 'absolute z-10 px-3 py-2 text-sm bg-gray-800 text-white rounded shadow-lg whitespace-pre transform -translate-x-1/2 -translate-y-full'
} as const;