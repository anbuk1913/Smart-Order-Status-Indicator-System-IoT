import { useState, useCallback } from 'react';
import { Layout } from '../components/layout/Layout';
import { TableGrid } from '../components/table/TableGrid';
import { AddTableModal } from '../components/table/AddTableModal';
import { OrderStatus } from '../components/order/OrderStatus';
import { useTables } from '../hooks/useTables';
import { useWebSocket } from '../hooks/useWebSocket';
import { tableService } from '../services/tableService';
import type { Table } from '../types/table';

export const HomePage = () => {
  const { tables, loading, refetch, setTables } = useTables();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleStatusUpdate = useCallback((updatedTable: Table) => {
    setTables((prev) =>
      prev.map((t) => (t._id === updatedTable._id ? updatedTable : t))
    );
  }, [setTables]);

  useWebSocket(handleStatusUpdate);

  const handleAddTable = async (tableName: string) => {
    await tableService.createTable({ tableName });
    refetch();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-2xl font-semibold text-gray-600">Loading tables...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Dining Tables</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Add Table
        </button>
      </div>

      {tables.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <p className="text-xl text-gray-600 mb-4">No tables added yet</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-200"
          >
            Add Your First Table
          </button>
        </div>
      ) : (
        <TableGrid
          tables={tables}
          onTableClick={setSelectedTable}
          onUpdate={refetch}
        />
      )}

      {selectedTable && (
        <OrderStatus
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
          onUpdate={() => {
            refetch();
            setSelectedTable(null);
          }}
        />
      )}

      <AddTableModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTable}
      />
    </Layout>
  );
};