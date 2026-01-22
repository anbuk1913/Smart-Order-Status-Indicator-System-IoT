import { useState, useEffect } from 'react'
import api from '../api/axios'
import TableCard from '../components/TableCard'
import Toast from '../components/Toast'
import ConfirmationModal from '../components/ConfirmationModal'
import { useAuth } from '../context/AuthContext'
import { FaPlus, FaSignOutAlt } from 'react-icons/fa'
import StarBackground from '../components/StarBackground'

const Dashboard = () => {
    const [tables, setTables] = useState([])
    const [newTableName, setNewTableName] = useState('')
    const { logout, user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [toast, setToast] = useState({ message: '', type: '', visible: false })
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [tableToDelete, setTableToDelete] = useState(null);

    const showToast = (message, type) => {
        setToast({ message, type, visible: true })
    }

    const handleCloseToast = () => {
        setToast({ ...toast, visible: false })
    }

    const fetchTables = async () => {
        try {
            const response = await api.get('/tables')
            setTables(response.data)
        } catch (error) {
            console.error('Error fetching tables:', error)
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchTables()
        const interval = setInterval(fetchTables, 5000)
        return () => clearInterval(interval)
    }, [])

    const handleAddTable = async (e) => {
        e.preventDefault();

        if (!newTableName.trim()) {
            showToast('Table Name is required', 'error');
            return;
        }

        try {
            await api.post('/tables', {
                tableName: newTableName
            })
            setNewTableName('')
            fetchTables()
            showToast('Table added successfully', 'success')
        } catch (error) {
            const errorMessage = error.response?.data?.detail || 'Error adding table';
            showToast(errorMessage, 'warning')
        }
    };

    const handleUpdateTable = async (id, updates) => {
        try {
            await api.put(`/tables/${id}`, updates)
            // Optimistic update or refetch
            setTables(tables.map(t => t._id === id ? { ...t, ...updates } : t))
            showToast('Table updated successfully', 'success')
        } catch (error) {
            console.error('Error updating table:', error)
            showToast('Error updating table', 'error')
        }
    };

    const handleDeleteTable = (id) => {
        setTableToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteTable = async () => {
        if (!tableToDelete) return;

        try {
            await api.delete(`/tables/${tableToDelete}`)
            setTables(tables.filter(t => t._id !== tableToDelete))
            showToast('Table deleted successfully', 'success')
        } catch (error) {
            console.error('Error deleting table:', error)
            showToast('Error deleting table', 'error')
        } finally {
            setIsDeleteModalOpen(false);
            setTableToDelete(null);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', position: 'relative' }}>
            <StarBackground />
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>Kitchen Dashboard</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span>Welcome, {user?.username}</span>
                    <button onClick={logout} className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </header>

            <section className="card" style={{ marginBottom: '2rem', opacity: 0.6 }}>
                <h3 style={{ marginTop: 0 }}>Add New Table</h3>
                <form onSubmit={handleAddTable} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Table Name (e.g. Window Seat)</label>
                        <input
                            type="text"
                            value={newTableName}
                            onChange={(e) => setNewTableName(e.target.value)}
                            // required  <-- Removed HTML validation
                            style={{ width: '100%', boxSizing: 'border-box' }}
                            className="bg-gray-800 text-white border border-gray-700 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary transition-transform duration-200 hover:scale-105 active:scale-95" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaPlus /> Add Table
                    </button>
                </form>
            </section>

            {toast.visible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={handleCloseToast}
                />
            )}

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteTable}
                title="Delete Table"
                message="Are you sure you want to delete this table? This action cannot be undone."
            />

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
