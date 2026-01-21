import { STATUS_COLORS } from '../../utils/constants';

interface StatusIndicatorProps {
  status: string;
  label: string;
}

export const StatusIndicator = ({ status, label }: StatusIndicatorProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-4 h-4 rounded-full ${STATUS_COLORS[status as keyof typeof STATUS_COLORS]}`} />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
};