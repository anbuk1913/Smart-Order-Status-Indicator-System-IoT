import { useState, useEffect } from 'react';
import api from '../api/axios';
import TableCard from '../components/TableCard';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaSignOutAlt } from 'react-icons/fa';

const Dashboard = () => {
    const [tables, setTables] = useState([]);
    const [newTableName, setNewTableName] = useState('');
    const { logout, user } = useAuth();
    const [loading, setLoading] = useState(true);

    const fetchTables = async () => {
        try {
            const response = await api.get('/tables');
            setTables(response.data);
        } catch (error) {
            console.error('Error fetching tables:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
        const interval = setInterval(fetchTables, 5000); // Polling every 5 sec
        return () => clearInterval(interval);
    }, []);

    const handleAddTable = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tables', {
                tableName: newTableName
            });
            setNewTableName('');
            fetchTables();
        } catch (error) {
            alert('Error adding table (ID might be duplicate)');
        }
    };

    const handleUpdateTable = async (id, updates) => {
        try {
            await api.put(`/tables/${id}`, updates);
            // Optimistic update or refetch
            setTables(tables.map(t => t._id === id ? { ...t, ...updates } : t));
        } catch (error) {
            console.error('Error updating table:', error);
        }
    };

    const handleDeleteTable = async (id) => {
        if (!window.confirm('Are you sure you want to delete this table?')) return;
        try {
            await api.delete(`/tables/${id}`);
            setTables(tables.filter(t => t._id !== id));
        } catch (error) {
            console.error('Error deleting table:', error);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>Kitchen Dashboard</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span>Welcome, {user?.username}</span>
                    <button onClick={logout} className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </header>

            <section className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginTop: 0 }}>Add New Table</h3>
                <form onSubmit={handleAddTable} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Table Name (e.g. Window Seat)</label>
                        <input
                            type="text"
                            value={newTableName}
                            onChange={(e) => setNewTableName(e.target.value)}
                            required
                            style={{ width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaPlus /> Add Table
                    </button>
                </form>
            </section>

            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {tables.map(table => (
                    <TableCard
                        key={table._id}
                        table={table}
                        onUpdate={handleUpdateTable}
                        onDelete={handleDeleteTable}
                    />
                ))}
            </section>
        </div>
    );
};

export default Dashboard;
