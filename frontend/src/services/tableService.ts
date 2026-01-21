import api from './api';
import type { Table, CreateTableDto, UpdateTableDto } from '../types/table';

export const tableService = {
  getAllTables: async (): Promise<Table[]> => {
    const response = await api.get<Table[]>('/tables');
    console.log("all table",response.data)
    return response.data;
  },

  getTable: async (id: string): Promise<Table> => {
    const response = await api.get<Table>(`/tables/${id}`);
    return response.data;
  },

  createTable: async (data: CreateTableDto): Promise<Table> => {
    const response = await api.post<Table>('/tables', data);
    return response.data;
  },

  updateTable: async (id: string, data: UpdateTableDto): Promise<Table> => {
    const response = await api.put<Table>(`/tables/${id}`, data);
    return response.data;
  },

  deleteTable: async (id: string): Promise<void> => {
    await api.delete(`/tables/${id}`);
  },

  updateStatus: async (id: string, status: string): Promise<Table> => {
    const response = await api.patch<Table>(`/tables/${id}/status`, { status });
    return response.data;
  },
};