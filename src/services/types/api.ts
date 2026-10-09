export interface ApiMeta {
  code?: number;
  status?: string;
  message?: string;
  request_id?: string;
  error?: unknown;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}
