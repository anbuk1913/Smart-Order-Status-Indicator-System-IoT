import { useState } from 'react';
import styled from 'styled-components';
import type { Table } from '../../types/table';
import { tableService } from '../../services/tableService';

interface TableModalProps {
  table: Table;
  onClose: () => void;
  onUpdate: () => void;
}

const STATUSES = ['idle', 'placed', 'processing', 'delivered'] as const;

const TableModal = ({ table, onClose, onUpdate }: TableModalProps) => {
  const [status, setStatus] = useState(table.status);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await tableService.updateTable(table.id, { status });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Status update failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <h2>Table Details</h2>

        {/* SHOW TABLE ID */}
        <p><strong>ID:</strong> {table.id}</p>
        <p><strong>Name:</strong> {table.tableName}</p>

        <h3>Change Status</h3>

        <div className="radio-group">
          {STATUSES.map((s) => (
            <label key={s}>
              <input
                type="radio"
                name="status"
                value={s}
                checked={status === s}
                onChange={() => setStatus(s)}
              />
              <span>{s.toUpperCase()}</span>
            </label>
          ))}
        </div>

        <div className="actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </Modal>
    </Overlay>
  );
};

export default TableModal;

/* ================= STYLES ================= */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Modal = styled.div`
  background: #fff;
  padding: 1.5rem;
  width: 360px;
  border-radius: 14px;

  h2 {
    margin-bottom: 0.5rem;
  }

  h3 {
    margin-top: 1rem;
  }

  p {
    font-size: 0.9rem;
    margin: 4px 0;
  }

  .radio-group {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 1.5rem;
  }

  .btn-cancel {
    background: #e5e7eb;
    padding: 6px 12px;
    border-radius: 6px;
  }

  .btn-save {
    background: #2563eb;
    color: #fff;
    padding: 6px 14px;
    border-radius: 6px;
  }

  .btn-save:disabled {
    opacity: 0.6;
  }
`;
