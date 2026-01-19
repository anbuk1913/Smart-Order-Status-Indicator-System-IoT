import { useState } from 'react';
import type { Table } from '../../types/table';
import { tableService } from '../../services/tableService';
import { ORDER_STATUSES, STATUS_COLORS } from '../../utils/constants';

interface OrderStatusProps {
  table: Table;
  onClose: () => void;
  onUpdate: () => void;
}

export const OrderStatus = ({ table, onClose, onUpdate }: OrderStatusProps) => {
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await tableService.updateStatus(table._id, newStatus);
      onUpdate();
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdating(false);
    }
  };

  const statuses = [
    { key: ORDER_STATUSES.IDLE, label: 'Idle', icon: '⏸️' },
    { key: ORDER_STATUSES.PLACED, label: 'Order Placed', icon: '📝' },
    { key: ORDER_STATUSES.PROCESSING, label: 'Processing', icon: '👨‍🍳' },
    { key: ORDER_STATUSES.DELIVERED, label: 'Delivered', icon: '✅' },
  ];

  return (
    <div className="modal-overlay animate-fadeIn">
      <div className="modal-container modal-container-lg animate-scaleIn">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{table.tableName}</h2>
            <p className="text-gray-500 text-sm mt-1">Manage order status and track progress</p>
          </div>
          <button
            onClick={onClose}
            className="modal-close"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Current Status Section */}
          <div className="status-modal-current">
            <div className="status-modal-current-label">Current Status</div>
            <div className={`status-modal-current-badge ${STATUS_COLORS[table.status]}`}>
              <span>{statuses.find(s => s.key === table.status)?.icon}</span>
              <span>{table.status.toUpperCase()}</span>
            </div>
          </div>

          {/* Update Status Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🔄</span>
              <span>Update Status</span>
            </h3>
            <div className="status-grid">
              {statuses.map((status) => (
                <button
                  key={status.key}
                  onClick={() => handleStatusChange(status.key)}
                  disabled={updating || table.status === status.key}
                  className={`status-button ${
                    table.status === status.key ? 'active' : ''
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">{status.icon}</span>
                    <span className="text-sm font-semibold">{status.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* LED Indicators Info */}
          <div className="info-card">
            <h4 className="info-card-title">LED Indicators Guide</h4>
            <ul className="info-card-list">
              <li>
                <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block mr-2"></span>
                <span><strong>LED 1 (Yellow)</strong> - Order Placed</span>
              </li>
              <li>
                <span className="w-3 h-3 rounded-full bg-blue-400 inline-block mr-2"></span>
                <span><strong>LED 2 (Blue)</strong> - Processing</span>
              </li>
              <li>
                <span className="w-3 h-3 rounded-full bg-green-400 inline-block mr-2"></span>
                <span><strong>LED 3 (Green)</strong> - Delivered</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};