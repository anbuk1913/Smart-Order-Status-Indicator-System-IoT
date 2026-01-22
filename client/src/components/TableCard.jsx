import { FaTrash, FaPen } from 'react-icons/fa';

const statusColors = {
    idle: 'var(--status-idle)',
    placed: 'var(--status-placed)',
    processing: 'var(--status-processing)',
    delivered: 'var(--status-delivered)'
};

const TableCard = ({ table, onUpdate, onDelete }) => {
    const isActive = table.isActive;

    const handleStatusChange = (newStatus) => {
        if (!isActive) return;
        onUpdate(table._id, { status: newStatus });
    };

    const handleToggleActive = () => {
        onUpdate(table._id, { isActive: !isActive });
    };

    return (
        <div className="card transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg" style={{
            opacity: isActive ? 1 : 0.5,
            borderLeft: `4px solid ${isActive ? statusColors[table.status] || 'gray' : 'var(--status-inactive)'}`
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>{table.tableName}</h3>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>#{table.tableId}</span>
            </div>

            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {Object.keys(statusColors).map((status) => (
                    <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        disabled={!isActive}
                        style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            border: '1px solid #333',
                            fontSize: '0.875rem',
                            backgroundColor: table.status === status ? statusColors[status] : 'transparent',
                            color: table.status === status ? '#fff' : 'var(--text-secondary)',
                            cursor: isActive ? 'pointer' : 'not-allowed',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {status.toUpperCase()}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label className="switch" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={handleToggleActive}
                            style={{ marginRight: '0.5rem' }}
                        />
                        <span style={{ fontSize: '0.875rem' }}>{isActive ? 'Active' : 'Inactive'}</span>
                    </label>
                </div>
                <button
                    onClick={() => onDelete(table._id)}
                    className="btn-danger transition-transform duration-200 hover:scale-110"
                    style={{ padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    );
};

export default TableCard;
