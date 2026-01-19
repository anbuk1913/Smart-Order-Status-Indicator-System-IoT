import { useState } from 'react';
import type { FormEvent } from 'react';

interface AddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tableName: string) => Promise<void>;
}

export const AddTableModal = ({ isOpen, onClose, onAdd }: AddTableModalProps) => {
  const [tableName, setTableName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!tableName.trim()) {
      setError('Table name is required');
      return;
    }

    setLoading(true);
    try {
      await onAdd(tableName);
      setTableName('');
      onClose();
    } catch (err) {
      console.error('Failed to add table', err);
      setError('Failed to add table. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay animate-fadeIn">
      <div className="modal-container add-table-modal">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Add New Table</h3>
            <p className="text-gray-500 text-sm mt-1">Create a new table for your restaurant</p>
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
          <form onSubmit={handleSubmit} id="add-table-form">
            <div className="form-group">
              <label className="form-label form-label-required">
                🍽️ Table Name
              </label>
              <div className="form-input-group">
                <input
                  type="text"
                  value={tableName}
                  onChange={(e) => {
                    setTableName(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g., Table 1, VIP Table, Outdoor 3"
                  className={`form-input ${error ? 'error' : ''}`}
                  required
                  autoFocus
                />
              </div>
              {error && (
                <div className="form-error-text">
                  {error}
                </div>
              )}
              <div className="form-helper-text">
                💡 Choose a descriptive name for easy identification
              </div>
            </div>

            {/* Preview Card */}
            {tableName.trim() && (
              <div className="card p-4 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 animate-fadeInUp">
                <div className="text-sm font-semibold text-gray-600 mb-2">Preview:</div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🍽️</span>
                  <span className="text-lg font-bold text-gray-800">{tableName}</span>
                  <span className="ml-auto px-3 py-1 bg-gray-400 text-white text-xs rounded-full">
                    IDLE
                  </span>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-table-form"
            className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
            disabled={loading}
          >
            {loading ? '' : '✨ Add Table'}
          </button>
        </div>
      </div>
    </div>
  );
};