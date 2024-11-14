import { Tool } from '@/types/tools'

// 工具数据缓存
let toolsCache: Tool[] | null = null
let lastFetchTime: number = 0
const CACHE_TTL = 5 * 60 * 1000 // 缓存有效期 5 分钟

/**
 * 从缓存获取工具数据
 */
export const getToolsFromCache = (): Tool[] | null => {
  if (!toolsCache || Date.now() - lastFetchTime > CACHE_TTL) {
    return null
  }
  return toolsCache
}

/**
 * 更新缓存数据
 */
export const updateToolsCache = (tools: Tool[]): void => {
  toolsCache = tools
  lastFetchTime = Date.now()
  console.log('🔄 Tools cache updated:', {
    count: tools.length,
    timestamp: new Date(lastFetchTime).toISOString()
  })
}

/**
 * 清除缓存
 */
export const clearToolsCache = (): void => {
  toolsCache = null
  lastFetchTime = 0
  console.log('🧹 Tools cache cleared')
} 