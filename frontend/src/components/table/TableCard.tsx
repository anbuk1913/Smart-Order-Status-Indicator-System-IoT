import { useState } from 'react';
import type { Table } from '../../types/table';
import { tableService } from '../../services/tableService';
import { STATUS_COLORS } from '../../utils/constants';

interface TableCardProps {
  table: Table;
  onClick: () => void;
  onUpdate: () => void;
}

export const TableCard = ({ table, onClick, onUpdate }: TableCardProps) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(table.tableName);

  const handleRename = async () => {
    if (newName.trim() && newName !== table.tableName) {
      try {
        await tableService.updateTable(table._id, { tableName: newName });
        onUpdate();
      } catch (err) {
        console.error('Failed to rename table', err);
      }
    }
    setIsRenaming(false);
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      idle: '⏸️',
      placed: '📝',
      processing: '👨‍🍳',
      delivered: '✅',
    };
    return icons[status] || '📋';
  };

  return (
    <div className="table-card hover-lift animate-fadeInUp">
      <div onClick={onClick} className="cursor-pointer">
        {/* Header */}
        <div className="table-card-header">
          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyPress={(e) => e.key === 'Enter' && handleRename()}
              className="form-input text-xl font-bold px-2 py-1"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h3 className="table-card-title flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <span>{table.tableName}</span>
            </h3>
          )}
          
          <span className={`table-card-status ${STATUS_COLORS[table.status]}`}>
            <span className="mr-1">{getStatusIcon(table.status)}</span>
            {table.status.toUpperCase()}
          </span>
        </div>

        {/* Progress Bar */}
        <div className={`table-card-progress ${STATUS_COLORS[table.status]}`} />

        {/* Status Description */}
        <div className="mt-4 text-sm text-gray-600">
          {table.status === 'idle' && '⏰ Waiting for order'}
          {table.status === 'placed' && '📋 Order received'}
          {table.status === 'processing' && '🔥 Cooking in progress'}
          {table.status === 'delivered' && '🎉 Ready to serve'}
        </div>
      </div>

      {/* Rename Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsRenaming(true);
        }}
        className="btn btn-secondary btn-sm w-full mt-4 flex items-center justify-center gap-2"
      >
        <span>✏️</span>
        <span>Rename</span>
      </button>
    </div>
  );
};