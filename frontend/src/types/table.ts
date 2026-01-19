export interface Table {
  _id: string;
  tableName: string;
  status: 'idle' | 'placed' | 'processing' | 'delivered';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTableDto {
  tableName: string;
}

export interface UpdateTableDto {
  tableName?: string;
  status?: string;
  isActive?: boolean;
}