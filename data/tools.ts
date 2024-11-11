export interface Tool {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
  favorites: number;
  categories: string[];
  link: string;
}

// 使用占位图片
const PLACEHOLDER_IMAGE = "/placeholder.svg";

export const tools: Tool[] = [
  {
    id: 1,
    name: "ChatGPT-4",
    description: "最新的GPT-4模型，支持多模态输入，理解力和创造力大幅提升，可处理更复杂的任务和对话。",
    imageUrl: PLACEHOLDER_IMAGE,
    rating: 4.9,
    favorites: 158924,
    categories: ["AI助手", "文字写作", "编程开发"],
    link: "https://chat.openai.com"
  },
  {
    id: 2,
    name: "Midjourney V6",
    description: "突破性的AI绘画引擎，超高还原度的图像生成，支持精确的人物面部和手部细节，照片级真实感。",
    imageUrl: PLACEHOLDER_IMAGE,
    rating: 4.9,
    favorites: 142567,
    categories: ["AI绘画", "设计创作", "图像处理"],
    link: "https://www.midjourney.com"
  },
  {
    id: 3,
    name: "Claude 3",
    description: "Anthropic最新AI助手，擅长学术写作和研究分析，支持更长上下文和精确的事实核查。",
    imageUrl: PLACEHOLDER_IMAGE,
    rating: 4.8,
    favorites: 89345,
    categories: ["AI助手", "学术研究", "数据分析"],
    link: "https://claude.ai"
  },
  {
    id: 4,
    name: "Stable Diffusion XL",
    description: "开源图像生成模型的最新版本，更强的细节表现，支持多风格融合和精确的场景构建。",
    imageUrl: PLACEHOLDER_IMAGE,
    rating: 4.7,
    favorites: 76234,
    categories: ["AI绘画", "开源工具", "创意设计"],
    link: "https://stability.ai"
  },
  {
    id: 5,
    name: "Notion AI Plus",
    description: "升级版Notion AI，支持多语言写作优化、自动内容组织、智能数据分析和团队协作。",
    imageUrl: PLACEHOLDER_IMAGE,
    rating: 4.8,
    favorites: 65789,
    categories: ["生产力工具", "团队协作", "内容管理"],
    link: "https://notion.so"
  },
  {
    id: 6,
    name: "Jasper Art",
    description: "专业的AI营销文案和视觉内容创作平台，整合多种AI模型，一站式解决营销素材需求。",
    imageUrl: PLACEHOLDER_IMAGE,
    rating: 4.7,
    favorites: 54321,
    categories: ["营销工具", "内容创作", "设计工具"],
    link: "https://jasper.ai"
  },
  {
    id: 7,
    name: "RunwayML Gen-2",
    description: "新一代AI视频生成和编辑工具，支持文本生成视频、场景扩展和智能视频编辑。",
    imageUrl: PLACEHOLDER_IMAGE,
    rating: 4.8,
    favorites: 43567,
    categories: ["视频制作", "创意工具", "特效处理"],
    link: "https://runway.ml"
  },
  {
    id: 8,
    name: "GitHub Copilot X",
    description: "升级版AI编程助手，支持自然语言编程对话、代码解释和安全性建议，提供全方位开发支持。",
    imageUrl: PLACEHOLDER_IMAGE,
    rating: 4.9,
    favorites: 98765,
    categories: ["编程开发", "AI助手", "开发工具"],
    link: "https://github.com/features/copilot"
  }
]; 