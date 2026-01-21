export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    idle: '#6B7280',
    placed: '#F59E0B',
    processing: '#3B82F6',
    delivered: '#10B981',
  };
  return colors[status] || '#6B7280';
};

export const getStatusIcon = (status: string): string => {
  const icons: Record<string, string> = {
    idle: '⏸️',
    placed: '📝',
    processing: '👨‍🍳',
    delivered: '✅',
  };
  return icons[status] || '📋';
};
