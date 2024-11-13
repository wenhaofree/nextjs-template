'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Share2, ExternalLink, Star, ArrowRight, Twitter, Facebook, Linkedin, Mail, Link as LinkIcon } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { tools } from "@/data/tools"
import { Header } from "@/components/layout/header"
import type { Tool } from "@/data/tools"
import { Footer } from "@/components/layout/footer"

export default function ProductPage() {
  const searchParams = useSearchParams()
  const toolId = searchParams.get('id')
  const tool = tools.find(t => t.id === Number(toolId))

  if (!tool) {
    return (
      <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#7B68EE] mb-4">工具未找到</h1>
          <Link href="/">
            <Button className="bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#0A0A1B]">
              返回首页
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const title = `Check out ${tool.name} - AI Tool`

  const shareLinks = [
    { name: 'X', icon: Twitter, url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}` },
    { name: 'Facebook', icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: 'LinkedIn', icon: Linkedin, url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}` },
    { name: 'Email', icon: Mail, url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}` },
    { name: 'Copy Link', icon: LinkIcon, url: shareUrl },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-4 text-[#7B68EE]">{tool.name}</h1>
            <p className="text-[#B0B0DA] mb-4">{tool.description}</p>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge className="bg-[#1E1E3A] text-[#7B68EE]">评分: {tool.rating}/5</Badge>
              {tool.updateDate && (
                <Badge className="bg-[#1E1E3A] text-[#7B68EE]">更新于: {tool.updateDate}</Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {tool.categories.map((category) => (
                <Badge 
                  key={category}
                  className="bg-[#1E1E3A] text-[#7B68EE]"
                >
                  {category}
                </Badge>
              ))}
            </div>
            <Button 
              className="bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#0A0A1B]"
              onClick={() => window.open(tool.link, '_blank')}
            >
              免费使用
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="rounded-lg overflow-hidden border border-[#2A2A4A]">
            {/* Social Media Sharing Buttons */}
            <div className="bg-[#1E1E3A] p-4 flex justify-end space-x-2">
              {shareLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="text-[#B0B0DA] hover:text-[#7B68EE] hover:bg-[#2A2A4A]"
                  onClick={() => {
                    if (link.name === 'Copy Link') {
                      navigator.clipboard.writeText(link.url)
                      alert('链接已复制到剪贴板！')
                    } else {
                      window.open(link.url, '_blank')
                    }
                  }}
                >
                  <link.icon className="w-5 h-5" />
                </Button>
              ))}
            </div>
            <Image
              src={tool.imageUrl}
              alt={`${tool.name} Preview`}
              width={600}
              height={400}
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-12 max-w-4xl">
          {/* Introduction */}
          <section className="bg-[#12122A] rounded-lg p-6 border border-[#2A2A4A]">
            <h2 className="text-xl font-semibold mb-4 text-[#7B68EE]">介绍</h2>
            <p className="text-[#B0B0DA]">{tool.description}</p>
          </section>

          {/* Features */}
          <section className="bg-[#12122A] rounded-lg p-6 border border-[#2A2A4A]">
            <h2 className="text-xl font-semibold mb-4 text-[#7B68EE]">核心功能</h2>
            <ul className="space-y-4 text-[#B0B0DA]">
              <li>• 智能提示生成</li>
              <li>• 多模型支持</li>
              <li>• 实时预览</li>
              <li>• 批量处理</li>
            </ul>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-xl font-semibold mb-6 text-[#7B68EE]">相关工具推荐</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools
                .filter(t => 
                  t.id !== tool.id && 
                  t.categories.some(c => tool.categories.includes(c))
                )
                .slice(0, 3)
                .map((relatedTool) => (
                  <Card 
                    key={relatedTool.id} 
                    className="bg-[#12122A] border-[#2A2A4A] overflow-hidden"
                  >
                    <Link href={`/product?id=${relatedTool.id}`} className="block">
                      <Image
                        src={relatedTool.imageUrl}
                        alt={relatedTool.name}
                        width={300}
                        height={200}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-[#7B68EE] mb-2">{relatedTool.name}</h3>
                        <p className="text-sm text-[#B0B0DA] mb-4 line-clamp-2">
                          {relatedTool.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-[#7B68EE] text-[#7B68EE]" />
                            <span className="text-sm text-[#B0B0DA]">{relatedTool.rating}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}