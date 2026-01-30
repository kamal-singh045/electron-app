export * from './auth.types';

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
}

export interface HelloResponse {
  message: string
  timestamp: string
}
