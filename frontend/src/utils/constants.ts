export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

// export const ORDER_STATUSES = {
//   IDLE: 'idle',
//   PLACED: 'placed',
//   PROCESSING: 'processing',
//   DELIVERED: 'delivered',
// } as const;

// export const STATUS_COLORS = {
//   idle: 'bg-gray-400',
//   placed: 'bg-yellow-500',
//   processing: 'bg-blue-500',
//   delivered: 'bg-green-500',
// };

// ============================================
// Restaurant Management System - Constants
// ============================================

// Order Status Constants
export const ORDER_STATUSES = {
  IDLE: 'idle',
  PLACED: 'placed',
  PROCESSING: 'processing',
  DELIVERED: 'delivered',
} as const;

// Status Colors (Tailwind classes)
export const STATUS_COLORS = {
  idle: 'bg-gray-400',
  placed: 'bg-amber-500',
  processing: 'bg-blue-500',
  delivered: 'bg-green-500',
} as const;

// Status Colors (CSS Variables for custom styles)
export const STATUS_COLORS_CSS = {
  idle: 'var(--status-idle)',
  placed: 'var(--status-placed)',
  processing: 'var(--status-processing)',
  delivered: 'var(--status-delivered)',
} as const;

// Status Glow Classes
export const STATUS_GLOW_CLASSES = {
  idle: 'status-glow-idle',
  placed: 'status-glow-placed',
  processing: 'status-glow-processing',
  delivered: 'status-glow-delivered',
} as const;

// Status Display Names
export const STATUS_LABELS = {
  idle: 'Idle',
  placed: 'Order Placed',
  processing: 'Processing',
  delivered: 'Delivered',
} as const;

// Status Icons
export const STATUS_ICONS = {
  idle: '⏸️',
  placed: '📝',
  processing: '👨‍🍳',
  delivered: '✅',
} as const;

// LED Mapping
export const LED_MAPPING = {
  placed: { number: 1, color: 'yellow', label: 'Order Placed' },
  processing: { number: 2, color: 'blue', label: 'Processing' },
  delivered: { number: 3, color: 'green', label: 'Delivered' },
} as const;

// Animation Delays (in ms)
export const ANIMATION_DELAYS = {
  STAGGER_ITEM: 100,
  MODAL_TRANSITION: 300,
  TOAST_DURATION: 3000,
} as const;
