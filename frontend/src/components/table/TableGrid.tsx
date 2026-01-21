import { useState } from 'react';
import type { Table } from '../../types/table';
import { TableCard } from './TableCard';
import TableModal from './TableModal';

interface TableGridProps {
  tables: Table[];
  onUpdate: () => void;
}

export const TableGrid = ({ tables, onUpdate }: TableGridProps) => {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  return (
    <>
      <div className="grid">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onClick={() => setSelectedTable(table)}
            onUpdate={onUpdate}
          />
        ))}
      </div>

      {selectedTable && (
        <TableModal
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};
