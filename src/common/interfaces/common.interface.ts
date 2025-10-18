export interface IMeta {
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface ApiResponse<T> {
  data: T | null;
  message: string | string[];
  status: number;
  error: boolean;
  meta?: IMeta;
  stack?: string;
  errorType?: string;
  timestamp?: string;
}
