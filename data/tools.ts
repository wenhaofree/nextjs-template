import { Tool } from '@/lib/db/tools'

export const tools: Tool[] = [
  {
    name: "Midjourney",
    description: "Midjourney是一款革命性的AI艺术生成工具，能够将文字描述转化为令人惊叹的视觉艺术作品。它支持多种艺术风格，从写实到抽象，从古典到现代，让创作者能够轻松实现他们的艺术愿景。",
    link: "https://www.midjourney.com",
    rating: 4.8,
    categories: ["AI绘画", "图像生成", "创意工具", "数字艺术"],
    slug: "midjourney",
    imageUrl: "https://cdn.sanity.io/images/u0v1th4q/production/389ae275b15d0c3179af91a585d2cf599b0ad835-1920x1080.jpg",
    features: [
      "高质量图像生成",
      "多样化的艺术风格",
      "直观的提示系统",
      "快速渲染速度",
      "Discord集成支持",
      "持续的模型更新"
    ],
    pricing: {
      startingPrice: "$10/month",
      plans: ["Basic", "Standard", "Pro", "Mega"]
    },
    updateDate: "2024-03-15"
  },
  {
    name: "ChatGPT",
    description: "ChatGPT是OpenAI开发的先进语言模型，能够进行自然、智能的对话交互。它可以帮助用户完成写作、编程、回答问题等多种任务。",
    link: "https://chat.openai.com",
    rating: 4.9,
    categories: ["AI对话", "写作助手", "编程工具"],
    slug: "chatgpt",
    imageUrl: "https://cdn.sanity.io/images/u0v1th4q/production/5fa07b81fb0d3024239fd9b3c52eef2c0f8e4e71-2048x1365.jpg",
    features: [
      "自然语言处理",
      "多语言支持",
      "代码生成与调试",
      "文本创作与编辑",
      "知识问答"
    ],
    pricing: {
      startingPrice: "$20/month",
      plans: ["Free", "Plus", "Team", "Enterprise"]
    },
    updateDate: "2024-03-18"
  }
] 