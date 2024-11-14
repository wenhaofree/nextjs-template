'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Twitter, Facebook, Linkedin, Mail, Link as LinkIcon } from 'lucide-react'
import { FallbackImage } from '@/components/ui/fallback-image'
import { Tool } from '@/app/lib/db/tools'
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { cn } from "@/app/lib/utils"

interface ToolDetailProps {
  tool: Tool
}

export function ToolDetail({ tool }: ToolDetailProps) {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
    const title = `Check out ${tool.name} - AI Tool`
  
    const shareLinks = [
      { name: 'X', icon: Twitter, url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`, target: '_blank' },
      { name: 'Facebook', icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, target: '_blank' },
      { name: 'LinkedIn', icon: Linkedin, url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`, target: '_blank' },
      { name: 'Email', icon: Mail, url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`, target: '_self' },
      { name: 'Copy Link', icon: LinkIcon, url: shareUrl, target: '_self' },
    ]
  
    const handleShareClick = (link: typeof shareLinks[0]) => {
      if (link.name === 'Copy Link') {
        navigator.clipboard.writeText(link.url)
        alert('链接已复制到剪贴板！')
      } else {
        window.open(link.url, link.target, link.target === '_blank' ? 'noopener noreferrer' : '')
      }
    }
  
    const renderMarkdownContent = (content: string) => {
      const sections = content.split('\n## ').filter(Boolean)
      const [title, ...rest] = sections

      return (
        <div className="space-y-8">
          {rest.map((section, index) => {
            const [sectionTitle, ...content] = section.split('\n')
            return (
              <section 
                key={index}
                className={cn(
                  "bg-[#12122A] rounded-lg p-6 border border-[#2A2A4A]",
                  "transition-all duration-200 hover:border-[#7B68EE]/50"
                )}
              >
                <h2 className="text-xl font-semibold mb-4 text-[#7B68EE]">{sectionTitle}</h2>
                <div className="prose prose-invert max-w-none">
                  {content.map((line, i) => {
                    if (line.trim().startsWith('-')) {
                      return (
                        <li key={i} className="text-[#B0B0DA] ml-4">
                          {line.trim().slice(2)}
                        </li>
                      )
                    }
                    if (line.trim().match(/^\d+\./)) {
                      return (
                        <li key={i} className="text-[#B0B0DA] ml-4">
                          {line.trim().replace(/^\d+\./, '')}
                        </li>
                      )
                    }
                    return (
                      <p key={i} className="text-[#B0B0DA]">
                        {line}
                      </p>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )
    }
  
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
                onClick={() => window.open(tool.link, '_blank', 'noopener noreferrer')}
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
                    onClick={() => handleShareClick(link)}
                  >
                    <link.icon className="w-5 h-5" />
                  </Button>
                ))}
              </div>
              <FallbackImage
                src={tool.imageUrl}
                alt={`${tool.name} Preview`}
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
  
          {/* Content Sections */}
          <div className="space-y-12 max-w-4xl">
            {/* Markdown Content */}
            {tool.content_markdown && renderMarkdownContent(tool.content_markdown)}
          </div>
        </main>
        <Footer />
      </div>
    )
  } 