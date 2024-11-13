// API 相关类型
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
} 