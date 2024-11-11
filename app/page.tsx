'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Star, ExternalLink, ArrowUp, Heart, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { tools } from "@/data/tools"
import { categoryGroups, type CategoryGroup } from '@/data/categories'
import { Header } from "@/components/layout/header"

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filteredTools, setFilteredTools] = useState(tools)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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

    // 监听浏览器的前进/后退事件
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
      // 使用 pushState 更新 URL
      window.history.pushState({ category: null }, '', '/')
    } else {
      setSelectedCategory(category)
      const filtered = tools.filter(tool => tool.categories.includes(category))
      setFilteredTools(filtered)
      // 使用 pushState 更新 URL
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

  const getCategoryCount = (category: string) => {
    return tools.filter(tool => tool.categories.includes(category)).length
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* 面包屑导航 - 仅在选择了分类时显示 */}
        {selectedCategory && (
          <nav className="flex items-center space-x-2 text-sm mb-8">
            <Link 
              href="/" 
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              首页
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <Link 
              href="/categories" 
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              分类
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-green-400">{selectedCategory}</span>
          </nav>
        )}

        {/* Hero Section */}
        {!selectedCategory && (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-green-400">发现最好的AI网站和AI工具</h1>
            <p className="text-gray-400 mb-6">21180个AI工具和263个分类已被来千万大咖和工具专家验证，AI工具内容质量均持有最高级ChatGPT等大数据审核。</p>
            <div className="max-w-2xl mx-auto relative">
              <Input
                placeholder="输入任意内容，使用AI提高效率，如：智能剪辑AI工具"
                className="pl-10 py-6 bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-black">
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
                <h2 className="text-2xl font-bold text-green-400 mb-2">{selectedCategory}</h2>
                <p className="text-gray-400">
                  找到 {filteredTools.length} 个相关工具
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetCategory}
                className="text-gray-400 hover:text-green-400"
              >
                返回全部工具
              </Button>
            </div>
          </div>
        )}

        {/* Filter Tags - 仅在未选择分类时显示 */}
        {!selectedCategory && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge variant="secondary" className="cursor-pointer bg-gray-800 text-green-400 hover:bg-gray-700">
              🌟 最新AI
            </Badge>
            <Badge variant="secondary" className="cursor-pointer bg-gray-800 text-green-400 hover:bg-gray-700">
              🔥 最多收藏
            </Badge>
            <Badge variant="secondary" className="cursor-pointer bg-gray-800 text-green-400 hover:bg-gray-700">
              👥 基于人群分
            </Badge>
            <Badge variant="secondary" className="cursor-pointer bg-gray-800 text-green-400 hover:bg-gray-700">
              🎯 测试推荐
            </Badge>
            <Badge variant="secondary" className="cursor-pointer bg-gray-800 text-green-400 hover:bg-gray-700">
              📱 Apps
            </Badge>
          </div>
        )}

        {/* Category Tabs - 仅在未选择分类时显示 */}
        {!selectedCategory && (
          <div className="flex flex-wrap gap-4 mb-8 text-sm">
            {Object.values(categoryGroups).flat().slice(0, 10).map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className="text-gray-400 hover:text-green-400 hover:bg-gray-800 px-3 py-1 rounded-full"
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <Card 
              key={tool.id} 
              className="opacity-0 animate-fade-in-up overflow-hidden hover:shadow-lg transition-shadow bg-gray-800 border-gray-700"
              style={{
                animationDelay: `${(filteredTools.indexOf(tool) % 4) * 0.1}s`,
                animationFillMode: 'forwards'
              }}
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
                    <h3 className="font-semibold text-green-400">{tool.name}</h3>
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {tool.description}
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-green-500 text-green-500" />
                        <span className="text-sm text-gray-400">{tool.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-pink-500" />
                        <span className="text-sm text-gray-400">
                          {tool.favorites.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tool.categories.map((category) => (
                        <Badge
                          key={category}
                          variant="secondary"
                          className="text-xs bg-gray-700 text-green-400"
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
            <p className="text-gray-400 text-lg">
              没有找到相关工具
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={handleResetCategory}
              className="mt-4"
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
          className="fixed bottom-8 right-8 bg-green-500 hover:bg-green-600 text-black p-2 rounded-full shadow-lg transition-all duration-300 ease-in-out"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}