import { NextResponse } from 'next/server'
import { tools } from '@/data/tools'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const tool = tools.find(t => t.slug === params.slug)
    
    if (!tool) {
      return new NextResponse('Tool not found', { status: 404 })
    }

    // 添加1秒延迟以展示加载状态 (仅用于演示)
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json(tool)
  } catch (error) {
    console.error('Error fetching tool:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 