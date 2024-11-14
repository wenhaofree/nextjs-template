// 定义前端使用的工具类型
export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  link: string;
  categories: string[];
  rating: number;
  updateDate: string;
  featured?: boolean;
  features?: string[];
  pricing?: {
    free: boolean;
    startingPrice: string;
    plans: string[];
  };
} 