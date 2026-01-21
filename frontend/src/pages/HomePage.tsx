import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { TableGrid } from '../components/table/TableGrid';
import { AddTableModal } from '../components/table/AddTableModal';
import { OrderStatus } from '../components/order/OrderStatus';
import { useTables } from '../hooks/useTables';
// import { useWebSocket } from '../hooks/useWebSocket';
import { tableService } from '../services/tableService';
import type { Table } from '../types/table';

export const HomePage = () => {
  const { tables, loading, refetch } = useTables();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // const handleStatusUpdate = useCallback((updatedTable: Table) => {
  //   setTables((prev) =>
  //     prev.map((t) => (t.id === updatedTable.id ? updatedTable : t))
  //   );
  // }, [setTables]);

  // useWebSocket(handleStatusUpdate);

  const handleAddTable = async (tableName: string) => {
    await tableService.createTable({ tableName });
    refetch();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">👨‍🍳</div>
            <div className="text-2xl font-semibold text-gray-600">Loading tables...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Header */}
      

      {/* Empty State */}
      {tables.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-xl text-gray-600 mb-6">No tables added yet</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary btn-lg shadow-lg"
          >
            <span className="text-xl mr-2">+</span>
            Add Your First Table
          </button>
        </div>
      ) : (
        <TableGrid
          tables={tables}
          // onTableClick={setSelectedTable}
          onUpdate={refetch}
        />
      )}

      {/* Modals */}
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