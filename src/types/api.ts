export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[] | string>;
  raw?: any;
}
