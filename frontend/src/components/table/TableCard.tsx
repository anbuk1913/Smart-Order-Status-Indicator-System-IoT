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
  const [isHovered, setIsHovered] = useState(false);
  // console.log("tab==",table)
  const handleRename = async () => {
    if (newName.trim() && newName !== table.tableName) {
      try {
        // console.log("Newnma",)
        await tableService.updateTable(table.id, { tableName: newName });
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

  const getStatusBg = (status: string) => {
    const colors: Record<string, string> = {
      idle: 'linear-gradient(135deg, #9ca3af, #6b7280)',
      placed: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
      processing: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
      delivered: 'linear-gradient(135deg, #34d399, #10b981)',
    };
    return colors[status] || colors.idle;
  };

  return (
    <div className='align'>
      <div 
        className="table-card-3d"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`table-card-content ${isHovered ? 'hovered' : ''}`}>
          {/* Back of Card */}
          <div className="table-card-back">
            <div className="table-card-back-inner">
              <div 
                className="table-card-back-gradient"
                style={{ background: getStatusBg(table.status) }}
              />
              <div className="table-card-back-content">
                <svg 
                  stroke="#ffffff" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 50 50" 
                  height="60px" 
                  width="60px" 
                  fill="#ffffff"
                >
                  <path d="M20.84375 0.03125C20.191406 0.0703125 19.652344 0.425781 19.21875 1.53125C18.988281 2.117188 18.5 3.558594 18.03125 4.9375C17.792969 5.636719 17.570313 6.273438 17.40625 6.75C17.390625 6.796875 17.414063 6.855469 17.40625 6.90625C17.398438 6.925781 17.351563 6.949219 17.34375 6.96875L17.25 7.25C18.566406 7.65625 19.539063 8.058594 19.625 8.09375C22.597656 9.21875 28.351563 11.847656 33.28125 16.78125C38.5 22 41.183594 28.265625 42.09375 30.71875C42.113281 30.761719 42.375 31.535156 42.75 32.84375C42.757813 32.839844 42.777344 32.847656 42.78125 32.84375C43.34375 32.664063 44.953125 32.09375 46.3125 31.625C47.109375 31.351563 47.808594 31.117188 48.15625 31C49.003906 30.714844 49.542969 30.292969 49.8125 29.6875C50.074219 29.109375 50.066406 28.429688 49.75 27.6875C49.605469 27.347656 49.441406 26.917969 49.25 26.4375C47.878906 23.007813 45.007813 15.882813 39.59375 10.46875C33.613281 4.484375 25.792969 1.210938 22.125 0.21875C21.648438 0.0898438 21.234375 0.0078125 20.84375 0.03125 Z M 16.46875 9.09375L0.0625 48.625C-0.09375 48.996094 -0.00390625 49.433594 0.28125 49.71875C0.472656 49.910156 0.738281 50 1 50C1.128906 50 1.253906 49.988281 1.375 49.9375L40.90625 33.59375C40.523438 32.242188 40.222656 31.449219 40.21875 31.4375C39.351563 29.089844 36.816406 23.128906 31.875 18.1875C27.035156 13.34375 21.167969 10.804688 18.875 9.9375C18.84375 9.925781 17.8125 9.5 16.46875 9.09375 Z M 17 16C19.761719 16 22 18.238281 22 21C22 23.761719 19.761719 26 17 26C15.140625 26 13.550781 24.972656 12.6875 23.46875L15.6875 16.1875C16.101563 16.074219 16.550781 16 17 16 Z M 31 22C32.65625 22 34 23.34375 34 25C34 25.917969 33.585938 26.730469 32.9375 27.28125L32.90625 27.28125C33.570313 27.996094 34 28.949219 34 30C34 32.210938 32.210938 34 30 34C27.789063 34 26 32.210938 26 30C26 28.359375 26.996094 26.960938 28.40625 26.34375L28.3125 26.3125C28.117188 25.917969 28 25.472656 28 25C28 23.34375 29.34375 22 31 22 Z M 21 32C23.210938 32 25 33.789063 25 36C25 36.855469 24.710938 37.660156 24.25 38.3125L20.3125 39.9375C18.429688 39.609375 17 37.976563 17 36C17 33.789063 18.789063 32 21 32 Z M 9 34C10.65625 34 12 35.34375 12 37C12 38.65625 10.65625 40 9 40C7.902344 40 6.960938 39.414063 6.4375 38.53125L8.25 34.09375C8.488281 34.03125 8.742188 34 9 34Z" />
                </svg>
                <strong className="text-white text-lg mt-3">{table.tableName}</strong>
              </div>
            </div>
          </div>

          {/* Front of Card */}
          <div className="table-card-front" onClick={onClick}>
            <div className="table-card-gradient-circles">
              <div className="circle circle-1" style={{ background: getStatusBg(table.status) }}></div>
              <div className="circle circle-2" style={{ background: getStatusBg(table.status) }}></div>
              <div className="circle circle-3" style={{ background: getStatusBg(table.status) }}></div>
            </div>
            
            <div className="table-card-front-content">
              <div className="table-card-badge">
                <span className={`status-badge ${STATUS_COLORS[table.status]}`}>
                  {table.status.toUpperCase()}
                </span>
              </div>

              <div className="table-card-description">
                <div className="table-card-title-section">
                  {isRenaming ? (
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onBlur={handleRename}
                      onKeyPress={(e) => e.key === 'Enter' && handleRename()}
                      className="form-input text-lg font-bold px-2 py-1"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <p className="table-title">
                        <strong>🍽️ {table.tableName}</strong>
                      </p>
                      <span className="text-2xl">{getStatusIcon(table.status)}</span>
                    </div>
                  )}
                </div>
                <p className="table-card-footer-text">
                  {table.status === 'idle' && '⏰ Waiting for order'}
                  {table.status === 'placed' && '📋 Order received'}
                  {table.status === 'processing' && '🔥 Cooking in progress'}
                  {table.status === 'delivered' && '🎉 Ready to serve'}
                </p>
              </div>
            </div>
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
          <span>Rename Table</span>
        </button>
      </div>
    </div>
  );
};
