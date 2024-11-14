import { NextResponse } from 'next/server'
import { Tool } from '@/types/tools'

// 扩展的示例数据
const toolsData: Tool[] = [
  {
    id: '1',
    slug: 'midjourney',
    name: 'Midjourney',
    description: 'Midjourney是一款革命性的AI艺术生成工具，能够将文字描述转化为令人惊叹的视觉艺术作品。',
    imageUrl: 'https://cdn.sanity.io/images/u0v1th4q/production/389ae275b15d0c3179af91a585d2cf599b0ad835-1920x1080.jpg',
    link: 'https://www.midjourney.com',
    categories: ['AI绘画', '图像生成', '创意工具'],
    rating: 4.8,
    updateDate: '2024-03-15',
    featured: true
  }
]

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  try {
    return NextResponse.json(toolsData)
  } catch (error) {
    console.error('Error fetching tools:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 