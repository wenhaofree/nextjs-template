import { Suspense } from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ExternalLink } from "lucide-react"
import Link from "next/link"
import { categoryGroups } from '@/data/categories'
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getTools } from '@/app/actions'
import { Tool } from '@/data/tools'
import { SearchBar } from '@/components/search-bar'
import { FallbackImage } from '@/components/ui/fallback-image'

// 工具卡片组件
function ToolCard({ tool }: { tool: Tool }) {
  // 将标题转换为 URL 友好的格式
  const titleSlug = tool.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return (
    <Card 
      key={tool.id} 
      className="bg-[#12122A] border-[#2A2A4A] overflow-hidden hover:shadow-lg hover:shadow-[#7B68EE]/10 transition-all duration-300"
    >
      <Link 
        href={`/tools/${titleSlug}`} 
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative w-full h-48 bg-[#1E1E3A]">
          <FallbackImage
            src={tool.imageUrl}
            alt={`${tool.name} preview`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={tool.id <= 4}
          />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-[#7B68EE]">{tool.name}</h3>
            <ExternalLink className="w-4 h-4 text-[#8080AA]" />
          </div>
          <p className="text-sm text-[#B0B0DA] mb-3 line-clamp-2">
            {tool.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-[#7B68EE] text-[#7B68EE]" />
              <span className="text-sm text-[#B0B0DA]">{tool.rating}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {tool.categories.map((category: string) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="text-xs bg-[#1E1E3A] text-[#7B68EE]"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  )
}

// 工具列表组件
async function ToolsGrid() {
  try {
    console.log('🎯 ToolsGrid component rendering...')
    const startTime = Date.now()

    const tools = await getTools()
    
    console.log('📊 ToolsGrid data loaded:', {
      count: tools.length,
      duration: `${Date.now() - startTime}ms`
    })
    
    if (!tools.length) {
      console.log('⚠️ No tools found')
      return (
        <div className="text-center py-12">
          <p className="text-[#B0B0DA] text-lg">
            暂无工具数据
          </p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    )
  } catch (error) {
    console.error('❌ Error in ToolsGrid:', error)
    return (
      <div className="text-center py-12">
        <p className="text-[#B0B0DA] text-lg">
          加载工具数据失败，请稍后重试
        </p>
      </div>
    )
  }
}

// 主页组件
export default async function Home() {
  console.log('🏠 Home page rendering...')
  
  return (
    <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#7B68EE] to-[#4169E1]">
            发现最好的AI网站和AI工具
          </h1>
          <p className="text-[#B0B0DA] mb-8 max-w-2xl mx-auto">
            21180个AI工具和263个分类已被来千万大咖和工具专家验证，AI工具内容质量均持有最高级ChatGPT等大数据审核。
          </p>
          <SearchBar />
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["🌟 最新AI", "🔥 最多收藏", "👥 基于人群分", "🎯 测试推荐", "📱 Apps"].map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="cursor-pointer bg-[#1E1E3A] text-[#7B68EE] hover:bg-[#2A2A4A] transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-4 mb-12 text-sm">
          {Object.values(categoryGroups).flat().slice(0, 10).map((category) => (
            <button
              key={category}
              className="text-[#B0B0DA] hover:text-[#7B68EE] hover:bg-[#1E1E3A] px-4 py-2 rounded-full transition-colors"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <Suspense 
          fallback={
            <div className="text-center py-12">
              <p className="text-[#B0B0DA] text-lg">加载中...</p>
            </div>
          }
        >
          <ToolsGrid />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}