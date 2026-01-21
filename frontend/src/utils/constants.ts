export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

export const ORDER_STATUSES = {
  IDLE: 'idle',
  PLACED: 'placed',
  PROCESSING: 'processing',
  DELIVERED: 'delivered',
} as const;

export const STATUS_COLORS = {
  idle: 'bg-gray-400',
  placed: 'bg-amber-500',
  processing: 'bg-blue-500',
  delivered: 'bg-green-500',
} as const;

export const STATUS_LABELS = {
  idle: 'Idle',
  placed: 'Order Placed',
  processing: 'Processing',
  delivered: 'Delivered',
} as const;

export const STATUS_ICONS = {
  idle: '⏸️',
  placed: '📝',
  processing: '👨‍🍳',
  delivered: '✅',
} as const;
