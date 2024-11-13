export interface Tool {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  link: string;
  rating: number;
  categories: string[];
  updateDate?: string;
}

export const tools: Tool[] = [
  {
    id: 1,
    name: "ChatGPT",
    description: "OpenAI开发的大型语言模型，能够进行自然对话、回答问题、写作和编程等多种任务。支持上下文理解和个性化交互。",
    imageUrl: "/tools/chatgpt.png",
    link: "https://chat.openai.com",
    rating: 4.9,
    categories: ["AI助手", "文字写作", "编程开发"],
    updateDate: "2024/1/20"
  },
  {
    id: 2,
    name: "Midjourney",
    description: "强大的AI艺术创作工具，通过文本描述生成高质量图像。支持多种艺术风格，适合设计师和创意工作者使用。",
    imageUrl: "/tools/midjourney.png",
    link: "https://www.midjourney.com",
    rating: 4.8,
    categories: ["AI绘画", "图像处理", "创意设计"],
    updateDate: "2024/1/18"
  },
  {
    id: 3,
    name: "Claude",
    description: "Anthropic开发的AI助手，擅长学术写作、分析和研究。具有强大的理解能力和专业知识库。",
    imageUrl: "/tools/claude.png",
    link: "https://claude.ai",
    rating: 4.7,
    categories: ["AI助手", "文字写作", "学术研究"],
    updateDate: "2024/1/15"
  },
  {
    id: 4,
    name: "Stable Diffusion",
    description: "开源的AI图像生成模型，支持本地部署。能够生成高质量艺术作品，支持多种风格转换和图像编辑。",
    imageUrl: "/tools/stable-diffusion.png",
    link: "https://stability.ai",
    rating: 4.6,
    categories: ["AI绘画", "图像处理", "开源工具"],
    updateDate: "2024/1/16"
  },
  {
    id: 5,
    name: "Copy.ai",
    description: "专业的AI营销文案工具，能够生成各类营销内容、社媒文案和广告文本。支持多种语言和风格。",
    imageUrl: "/tools/copyai.png",
    link: "https://www.copy.ai",
    rating: 4.5,
    categories: ["文字写作", "营销工具", "内容创作"],
    updateDate: "2024/1/19"
  },
  {
    id: 6,
    name: "Runway",
    description: "专业的AI视频编辑工具，支持视频生成、编辑和特效制作。适合创意视频制作和后期处理。",
    imageUrl: "/tools/runway.png",
    link: "https://runway.ml",
    rating: 4.7,
    categories: ["视频制作", "特效处理"],
    updateDate: "2024/1/17"
  },
  {
    id: 7,
    name: "GitHub Copilot",
    description: "AI驱动的代码助手，能够实时提供代码建议和自动完成。支持多种编程语言和开发环境。",
    imageUrl: "/tools/github-copilot.png",
    link: "https://github.com/features/copilot",
    rating: 4.8,
    categories: ["编程开发", "开发工具", "AI助手"],
    updateDate: "2024/1/14"
  },
  {
    id: 8,
    name: "Notion AI",
    description: "集成在Notion中的AI助手，支持写作、总结、翻译和内容生成。提高工作效率和内容质量。",
    imageUrl: "/tools/notion-ai.png",
    link: "https://notion.so",
    rating: 4.6,
    categories: ["生产力工具", "文字写作", "团队协作"],
    updateDate: "2024/1/13"
  },
  {
    id: 9,
    name: "Jasper",
    description: "专业的AI内容创作平台，支持长文创作、营销文案和社媒内容。具有团队协作功能。",
    imageUrl: "/tools/jasper.png",
    link: "https://jasper.ai",
    rating: 4.5,
    categories: ["文字写作", "营销工具", "内容创作"],
    updateDate: "2024/1/12"
  },
  {
    id: 10,
    name: "Synthesia",
    description: "AI视频生成平台，可将文本转换为专业的视频内容。支持多语言和自定义角色。",
    imageUrl: "/tools/synthesia.png",
    link: "https://www.synthesia.io",
    rating: 4.4,
    categories: ["视频制作", "内容创作"],
    updateDate: "2024/1/11"
  },
  {
    id: 11,
    name: "Otter.ai",
    description: "AI语音转文字工具，支持实时转录和会议记录。具有强大的编辑和共享功能。",
    imageUrl: "/tools/otter.png",
    link: "https://otter.ai",
    rating: 4.6,
    categories: ["生产力工具", "团队协作"],
    updateDate: "2024/1/10"
  },
  {
    id: 12,
    name: "Leonardo.ai",
    description: "专业的AI艺术创作平台，提供多种风格和工具。适合设计师和艺术家使用。",
    imageUrl: "/tools/leonardo.png",
    link: "https://leonardo.ai",
    rating: 4.7,
    categories: ["AI绘画", "创意设计"],
    updateDate: "2024/1/09"
  },
  {
    id: 13,
    name: "Grammarly",
    description: "AI写作助手，提供实时语法检查和写作建议。支持多种写作风格和场景。",
    imageUrl: "/tools/grammarly.png",
    link: "https://www.grammarly.com",
    rating: 4.8,
    categories: ["文字写作", "生产力工具"],
    updateDate: "2024/1/08"
  },
  {
    id: 14,
    name: "Descript",
    description: "AI视频和播客编辑工具，支持文本编辑视频和音频。具有强大的编辑功能。",
    imageUrl: "/tools/descript.png",
    link: "https://www.descript.com",
    rating: 4.5,
    categories: ["视频制作", "音频处理"],
    updateDate: "2024/1/07"
  },
  {
    id: 15,
    name: "Hugging Face",
    description: "AI模型和工具平台，提供大量开源模型和开发工具。支持多种AI应用场景。",
    imageUrl: "/tools/hugging-face.png",
    link: "https://huggingface.co",
    rating: 4.7,
    categories: ["开发工具", "开源工具"],
    updateDate: "2024/1/06"
  },
  {
    id: 16,
    name: "Canva",
    description: "集成AI功能的设计平台，支持智能设计和图像生成。适合各类设计需求。",
    imageUrl: "/tools/canva.png",
    link: "https://www.canva.com",
    rating: 4.8,
    categories: ["创意设计", "图像处理"],
    updateDate: "2024/1/05"
  },
  {
    id: 17,
    name: "Tome",
    description: "AI驱动的演示文稿创作工具，能够快速生成专业的演示内容。支持多种模板和风格。",
    imageUrl: "/tools/tome.png",
    link: "https://tome.app",
    rating: 4.4,
    categories: ["生产力工具", "内容创作"],
    updateDate: "2024/1/04"
  },
  {
    id: 18,
    name: "Anthropic Claude",
    description: "先进的AI助手，专注于安全和伦理的AI交互。适合专业和研究用途。",
    imageUrl: "/tools/anthropic.png",
    link: "https://anthropic.com",
    rating: 4.6,
    categories: ["AI助手", "学术研究"],
    updateDate: "2024/1/03"
  },
  {
    id: 19,
    name: "Gamma",
    description: "AI驱动的文档和演示工具，能够自动生成专业文档和报告。支持团队协作。",
    imageUrl: "/tools/gamma.png",
    link: "https://gamma.app",
    rating: 4.5,
    categories: ["生产力工具", "团队协作"],
    updateDate: "2024/1/02"
  },
  {
    id: 20,
    name: "Firefly",
    description: "Adobe的AI创意工具，支持图像生成和编辑。集成Adobe生态系统。",
    imageUrl: "/tools/firefly.png",
    link: "https://firefly.adobe.com",
    rating: 4.7,
    categories: ["AI绘画", "图像处理", "创意设计"],
    updateDate: "2024/1/01"
  }
]; 