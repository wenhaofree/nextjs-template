'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Star, ExternalLink, ArrowUp, Cpu, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { tools } from "@/data/tools"
import { categoryGroups } from '@/data/categories'
import { Header } from "@/components/layout/header"

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filteredTools, setFilteredTools] = useState(tools)

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // URL 参数和浏览器历史处理
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const categoryParam = urlParams.get('category')
      
      if (categoryParam) {
        setSelectedCategory(categoryParam)
        setFilteredTools(tools.filter(tool => tool.categories.includes(categoryParam)))
      } else {
        setSelectedCategory(null)
        setFilteredTools(tools)
      }
    }

    window.addEventListener('popstate', handlePopState)

    // 初始加载时处理 URL 参数
    const urlParams = new URLSearchParams(window.location.search)
    const categoryParam = urlParams.get('category')
    if (categoryParam) {
      setSelectedCategory(categoryParam)
      setFilteredTools(tools.filter(tool => tool.categories.includes(categoryParam)))
    }

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null)
      setFilteredTools(tools)
      window.history.pushState({ category: null }, '', '/')
    } else {
      setSelectedCategory(category)
      const filtered = tools.filter(tool => tool.categories.includes(category))
      setFilteredTools(filtered)
      window.history.pushState(
        { category }, 
        '', 
        `/?category=${encodeURIComponent(category)}`
      )
    }
  }

  const handleResetCategory = () => {
    setSelectedCategory(null)
    setFilteredTools(tools)
    window.history.pushState({ category: null }, '', '/')
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* 面包屑导航 - 仅在选择了分类时显示 */}
        {selectedCategory && (
          <nav className="flex items-center space-x-2 text-sm mb-8">
            <Link 
              href="/" 
              className="text-[#B0B0DA] hover:text-[#7B68EE] transition-colors"
              onClick={(e) => {
                e.preventDefault()
                handleResetCategory()
              }}
            >
              首页
            </Link>
            <ChevronRight className="w-4 h-4 text-[#3A3A5A]" />
            <Link 
              href="/categories" 
              className="text-[#B0B0DA] hover:text-[#7B68EE] transition-colors"
            >
              分类
            </Link>
            <ChevronRight className="w-4 h-4 text-[#3A3A5A]" />
            <span className="text-[#7B68EE]">{selectedCategory}</span>
          </nav>
        )}

        {/* Hero Section - 仅在未选择分类时显示 */}
        {!selectedCategory && (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#7B68EE] to-[#4169E1]">
              发现最好的AI网站和AI工具
            </h1>
            <p className="text-[#B0B0DA] mb-8 max-w-2xl mx-auto">
              21180个AI工具和263个分类已被来千万大咖和工具专家验证，AI工具内容质量均持有最高级ChatGPT等大数据审核。
            </p>
            <div className="max-w-2xl mx-auto relative">
              <Input
                placeholder="输入任意内容，使用AI提高效率，如：智能剪辑AI工具"
                className="pl-10 py-6 bg-[#1E1E3A] border-[#3A3A5A] text-[#E0E0FF] placeholder-[#8080AA]"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8080AA]" />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#0A0A1B]">
                搜索
              </Button>
            </div>
          </div>
        )}

        {/* 分类标题和工具数量 */}
        {selectedCategory && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#7B68EE] mb-2">{selectedCategory}</h2>
                <p className="text-[#B0B0DA]">
                  找到 {filteredTools.length} 个相关工具
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetCategory}
                className="text-[#B0B0DA] hover:text-[#7B68EE] border-[#2A2A4A] hover:bg-[#1E1E3A]"
              >
                返回全部工具
              </Button>
            </div>
          </div>
        )}

        {/* Filter Tags - 仅在未选择分类时显示 */}
        {!selectedCategory && (
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
        )}

        {/* Category Tabs - 仅在未选择分类时显示 */}
        {!selectedCategory && (
          <div className="flex flex-wrap gap-4 mb-12 text-sm">
            {Object.values(categoryGroups).flat().slice(0, 10).map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className="text-[#B0B0DA] hover:text-[#7B68EE] hover:bg-[#1E1E3A] px-4 py-2 rounded-full transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <Card 
              key={tool.id} 
              className="bg-[#12122A] border-[#2A2A4A] overflow-hidden hover:shadow-lg hover:shadow-[#7B68EE]/10 transition-all duration-300"
            >
              <Link href={tool.link} className="block">
                <Image
                  src={tool.imageUrl}
                  alt={`${tool.name} preview`}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
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
                      {tool.categories.map((category) => (
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
          ))}
        </div>

        {/* 如果没有找到工具 */}
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#B0B0DA] text-lg">
              没有找到相关工具
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={handleResetCategory}
              className="mt-4 text-[#B0B0DA] hover:text-[#7B68EE] border-[#2A2A4A] hover:bg-[#1E1E3A]"
            >
              查看所有工具
            </Button>
          </div>
        )}
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#0A0A1B] p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}