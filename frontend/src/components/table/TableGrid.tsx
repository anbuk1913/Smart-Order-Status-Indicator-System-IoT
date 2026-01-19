import type { Table } from '../../types/table';
import { TableCard } from './TableCard';

interface TableGridProps {
  tables: Table[];
  onTableClick: (table: Table) => void;
  onUpdate: () => void;
}

export const TableGrid = ({ tables, onTableClick, onUpdate }: TableGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tables.map((table) => (
        <TableCard
          key={table._id}
          table={table}
          onClick={() => onTableClick(table)}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};