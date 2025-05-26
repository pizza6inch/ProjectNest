// User type example
export interface User {
  user_id?: string;
  name?: string;
  email?: string;
  role?: string;
  image_url?: string;
  create_at?: string;
  update_at?: string;
}

export type GetUsersParams = {
  role?: string;
  sort_by?: string;
  page?: number;
  pageSize?: number;
  keyword?: string;
};

export interface GetUsersResponse {
  page: number;
  pageSize: number;
  total: number;
  results: User[];
}
