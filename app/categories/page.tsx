'use client'

import { useState, useEffect, useMemo } from 'react'
import { categoryGroups } from '@/data/categories'
import { tools } from '@/data/tools'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"

interface CategoryData {
  name: string
  count: number
  description: string
  icon: string
}

interface CategoryGroup {
  title: string
  description: string
  icon: string
  items: CategoryData[]
}

export default function CategoriesPage() {
  const [activeCategory, setActiveCategory] = useState('')

  const enrichedCategories = useMemo(() => [
    {
      title: "内容创作",
      description: "AI驱动的写作和内容生成工具",
      icon: "✍️",
      items: categoryGroups.content.map(cat => ({
        name: cat,
        count: tools.filter(tool => tool.categories.includes(cat)).length,
        description: getCategoryDescription(cat),
        icon: getCategoryIcon(cat)
      }))
    },
    {
      title: "图像处理",
      description: "AI图生成和编辑工具",
      icon: "🎨",
      items: categoryGroups.image.map(cat => ({
        name: cat,
        count: tools.filter(tool => tool.categories.includes(cat)).length,
        description: getCategoryDescription(cat),
        icon: getCategoryIcon(cat)
      }))
    },
    {
      title: "视频制作",
      description: "AI视频创作和编辑工具",
      icon: "🎥",
      items: categoryGroups.video.map(cat => ({
        name: cat,
        count: tools.filter(tool => tool.categories.includes(cat)).length,
        description: getCategoryDescription(cat),
        icon: getCategoryIcon(cat)
      }))
    },
    {
      title: "开发工具",
      description: "AI编程和开发辅助工具",
      icon: "💻",
      items: categoryGroups.development.map(cat => ({
        name: cat,
        count: tools.filter(tool => tool.categories.includes(cat)).length,
        description: getCategoryDescription(cat),
        icon: getCategoryIcon(cat)
      }))
    },
    {
      title: "效率工具",
      description: "AI驱动的生产力和协作工具",
      icon: "⚡",
      items: categoryGroups.productivity.map(cat => ({
        name: cat,
        count: tools.filter(tool => tool.categories.includes(cat)).length,
        description: getCategoryDescription(cat),
        icon: getCategoryIcon(cat)
      }))
    },
    {
      title: "商业应用",
      description: "AI商业和数据分析工具",
      icon: "💼",
      items: categoryGroups.business.map(cat => ({
        name: cat,
        count: tools.filter(tool => tool.categories.includes(cat)).length,
        description: getCategoryDescription(cat),
        icon: getCategoryIcon(cat)
      }))
    }
  ], [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const categoryElements = enrichedCategories.map(cat => 
        document.getElementById(cat.title)
      )
      const activeCategory = categoryElements.reduce((acc, el) => {
        if (el && el.offsetTop <= scrollPosition + 100) {
          return el.id
        }
        return acc
      }, '')
      setActiveCategory(activeCategory)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [enrichedCategories])

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
      <Header />
      
      <div className="flex pt-16">
        {/* Navigation Sidebar */}
        <nav className="w-64 h-[calc(100vh-4rem)] bg-[#12122A] p-6 fixed left-0 overflow-y-auto border-r border-[#2A2A4A]">
          <div className="space-y-6">
            {enrichedCategories.map((category, index) => (
              <div key={index}>
                <button
                  onClick={() => scrollToCategory(category.title)}
                  className={`w-full text-left px-4 py-2 rounded transition-colors ${
                    activeCategory === category.title
                      ? 'bg-[#7B68EE] text-[#0A0A1B]'
                      : 'text-[#B0B0DA] hover:bg-[#1E1E3A] hover:text-[#7B68EE]'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.title}
                </button>
              </div>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          {enrichedCategories.map((category, index) => (
            <section
              key={index}
              id={category.title}
              className="mb-16 opacity-0 animate-fade-in-up"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'forwards'
              }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#7B68EE] flex items-center">
                  <span className="mr-3">{category.icon}</span>
                  {category.title}
                </h2>
                <p className="text-[#B0B0DA] mt-2">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-[#12122A] rounded-lg overflow-hidden border border-[#2A2A4A] hover:shadow-lg hover:shadow-[#7B68EE]/10 transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3">{item.icon}</span>
                        <h3 className="text-xl font-semibold text-[#7B68EE]">{item.name}</h3>
                      </div>
                      <p className="text-[#B0B0DA] text-sm mb-4">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[#B0B0DA] text-sm">工具数量</span>
                        <span className="text-[#7B68EE] font-bold">{item.count}</span>
                      </div>
                    </div>
                    <Link 
                      href={`/?category=${item.name}`}
                      className="block bg-[#1E1E3A] px-6 py-3 text-[#7B68EE] hover:text-[#6A5ACD] hover:bg-[#2A2A4A] transition-colors duration-200"
                    >
                      查看工具 →
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  )
}

// 辅助函数：获取分类描述
function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    "文字写作": "AI驱动的写作助手和内容生成工具",
    "内容创作": "智能内容创作和编辑工具",
    "内容管理": "AI辅助的内容组织和管理系统",
    "AI绘画": "智能艺术创作和图像生成工具",
    "图像处理": "AI驱动的图像编辑和优化工具",
    "设计创作": "智能设计辅助和创意工具",
    "创意设计": "AI支持的创意设计解决方案",
    "视频制作": "智能视频创作和编辑工具",
    "特效处理": "AI驱动的视频特效和处理工具",
    "编程开发": "AI辅助编程和开发工具",
    "开源工具": "开源的AI开发工具和框架",
    "开发工具": "智能化的开发辅助工具",
    "AI助手": "智能对话和任务辅助工具",
    "生产力工具": "提升效率的AI工具集",
    "团队协作": "AI驱动的团队协作解决方案",
    "营销工具": "智能营销和推广工具",
    "数据分析": "AI支持的数据分析工具",
    "学术研究": "面向学术研究的AI工具"
  }
  return descriptions[category] || "AI驱动的智能工具"
}

// 辅助函数：获取分类图标
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    "文字写作": "✍️",
    "内容创作": "📝",
    "内容管理": "📊",
    "AI绘画": "🎨",
    "图像处理": "🖼️",
    "设计创作": "🎯",
    "创意设计": "💡",
    "视频制作": "🎥",
    "特效处理": "✨",
    "编程开发": "💻",
    "开源工具": "🔧",
    "开发工具": "⚙️",
    "AI助手": "🤖",
    "生产力工具": "⚡",
    "团队协作": "👥",
    "营销工具": "📢",
    "数据分析": "📊",
    "学术研究": "🎓"
  }
  return icons[category] || "🔧"
} 