import type { ReactNode } from 'react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AddTableModal } from '../../components/table/AddTableModal';
import { tableService } from '../../services/tableService';
import { useTables } from '../../hooks/useTables';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { refetch } = useTables();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { logout } = useAuth();

  const handleAddTable = async (tableName: string) => {
      await tableService.createTable({ tableName });
      refetch();
  };

  return (
    <div className="  from-orange-50 via-red-50 to-orange-100">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container-custom px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
              <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary  text-xl"
        ><b>
          +
          </b>
        </button>
              <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <span>🍽️</span>
            <span>Dining Tables</span>
          </h2>
          <p className="text-gray-600 mt-1">Manage your restaurant tables and orders</p>
        </div>
            <button
              onClick={logout}
              className="btn btn-secondary flex items-center gap-2"
            >
              <span>🚪Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container-custom px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container-custom px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-500">
          <p>© 2026 Hotel Chef Dashboard. All rights reserved.</p>
        </div>
      </footer>
      <AddTableModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onAdd={handleAddTable}
            />
    </div>    
  );
};
