import { getTools } from './actions'

export async function preloadTools() {
  console.log('🚀 Starting tools preload...')
  const startTime = Date.now()
  
  try {
    const tools = await getTools()
    
    console.log('✅ Tools preloaded successfully:', {
      count: tools.length,
      duration: `${Date.now() - startTime}ms`
    })

    return tools
  } catch (error) {
    console.error('❌ Error preloading tools:', error)
    throw error
  }
} 