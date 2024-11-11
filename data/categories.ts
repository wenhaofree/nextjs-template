// 从工具数据中提取所有唯一的分类
import { tools } from './tools'

// 获取所有唯一分类
const allCategories = Array.from(
  new Set(tools.flatMap(tool => tool.categories))
).sort()

// 分类组
export const categoryGroups = {
  content: ["文字写作", "内容创作", "内容管理"],
  image: ["AI绘画", "图像处理", "设计创作", "创意设计"],
  video: ["视频制作", "特效处理"],
  development: ["编程开发", "开源工具", "开发工具"],
  productivity: ["AI助手", "生产力工具", "团队协作"],
  business: ["营销工具", "数据分析", "学术研究"],
}

export type CategoryGroup = keyof typeof categoryGroups 