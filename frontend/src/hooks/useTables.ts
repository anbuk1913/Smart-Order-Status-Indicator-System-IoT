import { useState, useEffect } from 'react';
import { tableService } from '../services/tableService';
import type { Table } from '../types/table';

export const useTables = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const data = await tableService.getAllTables();
      setTables(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tables');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return { tables, loading, error, refetch: fetchTables, setTables };
};