'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Globe, LinkIcon, Languages, CreditCard, Check, Copy } from 'lucide-react'
import Link from "next/link"
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { useUser } from '@clerk/nextjs'
import { usePlan } from '@/hooks/usePlan'
import { UserAPI } from '@/lib/api/user'
import { SubmissionsAPI } from '@/lib/api/submissions'

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

// 修改测试函数
const testPaymentSuccess = async (userId: string, planType: string) => {
  try {
    const result = await UserAPI.updatePlan(userId, planType)
    
    if (!result.success) {
      throw new Error(result.error)
    }

    return true
  } catch (error) {
    console.error('❌ 版本升级失败:', error)
    return false
  }
}

export default function Component() {
  const { user } = useUser()
  const { plan, isLoading: isPlanLoading } = usePlan()
  const [selectedPlan, setSelectedPlan] = useState('free')
  const [isUpdating, setIsUpdating] = useState(false)

  const features = [
    {
      title: "来自100个国家的观众",
      description: "最受欢迎的观众来自美国、英国、加拿大、中国、日本、韩国、印度、法国、新加坡...",
      icon: Globe,
    },
    {
      title: "获取 DR 60 反向链接",
      description: "获得永久的高质量高功率反向链接，以提高您的网站和产品的知名度和权威性。",
      icon: LinkIcon,
    },
    {
      title: "支持5种语言",
      description: "您的产品介绍将以至少5种语言传播，覆盖更多国家的用户，未来还会增加更多。",
      icon: Languages,
    },
    {
      title: "价格低廉，永久曝光",
      description: "我们有多层定价来帮助初创公司节省推广成本，当然贵助商也会有更多的首页曝光率！",
      icon: CreditCard,
    },
  ]

  const plans = [
    {
      id: 'free',
      name: "免费提交",
      price: "0",
      description: "添加我们的链接到您的网站主页即可免费提交",
      features: [
        "7天内添加到列表",
        "需要添加以下链接到主页：",
        {
          type: 'code',
          content: '<a href="https://aiwith.me/" title="AI With Me: Discover thousands of AI Tools">AI With Me</a>'
        }
      ]
    },
    {
      id: 'one-time',
      name: "一次性提交",
      price: "16.9",
      originalPrice: "19.9",
      description: "一次提交，不用担心持续扣费",
      features: ["无需添加我们的反向链接"]
    },
    {
      id: 'unlimited',
      name: "无限制提交 AI",
      price: "24.9",
      originalPrice: "39.9",
      description: "每月无限提交AI",
      features: ["您可以随时取消", "无需添加我们的反向链接"]
    },
    {
      id: 'sponsor',
      name: "赞助广告",
      price: "39.9",
      originalPrice: "59.9",
      description: "置顶的工具显示在顶部广告位置",
      features: ["受益最高的展示效果", "无需添加我们的反向链接"]
    },
  ]

  const faqs = [
    {
      question: "[AI With Me]什么时候会白名单的工具?",
      answer: "我们会在收到提交后的48小时内审核您的工具。"
    },
    {
      question: "退款政策是什么?",
      answer: "如果您对我们的服务不满意，我们提供30天内全额退款保证。"
    },
    {
      question: "提交的工具可以永远保留在主页上吗?",
      answer: "是的，只要您的工具符合我们的社区准则，它将永久保留在我们的平台上。"
    },
    {
      question: "赞助政策是什么?",
      answer: "赞助商将获得优先展示位置、更多的展示机会以及专属的推广支持。"
    },
    {
      question: "为什么显示交的网站没有显示在页面上?",
      answer: "所有提交的网站都需要经过审核流程，这可能需要一些时间。如果超过48小时仍未显示，请联系我们的支持团队。"
    },
  ]

  const handleSubmit = async () => {
    if (!user) {
      alert('请先登录')
      window.location.href = '/sign-in'
      return
    }

    if (!plan) {
      alert('无法获取用户计划信息')
      return
    }

    // 获取输入值
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement
    const urlInput = document.querySelector('input[name="url"]') as HTMLInputElement
    const name = nameInput?.value?.trim()
    const url = urlInput?.value?.trim()

    // 验证输入
    if (!name || !url) {
      alert('请填写完整信息')
      return
    }

    try {
      // 如果不是免费用户，保存提交数据
      if (plan?.type !== 'free') {
        await SubmissionsAPI.create({
          name,
          url,
          userId: user.id,
          userPlan: plan.type,
        })
        console.log('✅ Submission saved for paid user')
      }

      // 继续原有的支付流程...
      if (process.env.NODE_ENV === 'development') {
        setIsUpdating(true)
        try {
          const testResult = await testPaymentSuccess(user.id, selectedPlan)
          if (testResult) {
            alert('版本升级成功！请查看控制台日志')
            window.location.reload()
            return
          } else {
            alert('版本升级失败，请查看控制台错误日志')
          }
        } finally {
          setIsUpdating(false)
        }
        return
      }

      // 正常的支付流程...
      const stripePaymentUrl = new URL('https://buy.stripe.com/test_9AQ4hH5cc0GE3Ju5kk')
      stripePaymentUrl.searchParams.append('client_reference_id', user.id)
      stripePaymentUrl.searchParams.append('metadata[userId]', user.id)
      stripePaymentUrl.searchParams.append('metadata[plan]', selectedPlan)
      
      window.location.href = stripePaymentUrl.toString()

    } catch (error) {
      console.error('❌ Error saving submission:', error)
      alert('保存提交信息失败，请重试')
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
    <Header/>
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#7B68EE] to-[#4169E1]">
            提交你的 AI 工具在这里
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-[#32CD32]">✓</span>
            <span className="text-[#B0B0DA]">立即提交您的AI工具即可获得</span>
            <span className="text-[#7B68EE]">AI With Me Domain Rating(DR): 60</span>
          </div>
          <p className="text-[#B0B0DA] max-w-3xl mx-auto">
            AI With Me 可以帮助您接触到全球数百万 AI 用户和潜在客户。触达AI爱好者、AI创业者、AI投资人、VP等，提高产品认知度、试用率和付费用户。
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-[#12122A] border-[#2A2A4A] p-6">
              <feature.icon className="w-8 h-8 text-[#7B68EE] mb-4" />
              <h3 className="text-lg font-semibold text-[#7B68EE] mb-2">{feature.title}</h3>
              <p className="text-[#B0B0DA] text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Submission Form */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="space-y-4">
            <Input
              name="name"
              placeholder="网站名称 e.g. AI With Me"
              className="bg-[#12122A] border-[#2A2A4A] text-[#E0E0FF] placeholder:text-[#B0B0DA]"
            />
            <Input
              name="url"
              placeholder="网站地址 e.g. https://iwith.me/"
              className="bg-[#12122A] border-[#2A2A4A] text-[#E0E0FF] placeholder:text-[#B0B0DA]"
            />
          </div>

          {/* Plan Selection */}
          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`bg-[#12122A] border-2 cursor-pointer transition-all h-full ${
                  selectedPlan === plan.id ? 'border-[#7B68EE]' : 'border-[#2A2A4A]'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div className="p-6 flex flex-col h-full">
                  <div>
                    <h3 className="font-semibold text-[#7B68EE] text-lg">{plan.name}</h3>
                    <div className="flex items-baseline mt-2 gap-2">
                      <span className="text-3xl font-bold text-[#7B68EE]">${plan.price}</span>
                      {plan.originalPrice && (
                        <span className="text-sm text-[#B0B0DA] line-through">
                          ${plan.originalPrice}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-[#B0B0DA] text-sm">{plan.description}</p>
                  </div>
                  
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-[#B0B0DA]">
                        <Check className="w-4 h-4 text-[#32CD32] mt-0.5 shrink-0" />
                        {typeof feature === 'string' ? (
                          <span>{feature}</span>
                        ) : feature.type === 'code' ? (
                          <div className="flex-1">
                            <div className="bg-[#1A1A2E] p-2 rounded-md font-mono text-xs relative group">
                              {feature.content}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(feature.content);
                                }}
                                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="复制代码"
                              >
                                <Copy className="w-4 h-4 hover:text-[#7B68EE]" />
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link 
              href="/price" 
              className="text-[#7B68EE] hover:text-[#6A5ACD] text-sm"
            >
              查看定价详情
            </Link>
          </div>
          {!isPlanLoading && plan && (
            <div className="text-center mb-4">
              <p className="text-[#B0B0DA]">
                当前计划: <span className="text-[#7B68EE]">{plan.type}</span>
                {isUpdating && <span className="ml-2">（更新中...）</span>}
              </p>
            </div>
          )}
          <Button 
            onClick={handleSubmit}
            disabled={isUpdating}
            className="w-full mt-8 bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#0A0A1B] disabled:opacity-50"
          >
            {isUpdating ? '版本升级中...' : (process.env.NODE_ENV === 'development' ? '测试版本升级' : '提交')}
          </Button>
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#7B68EE] mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-[#12122A] border border-[#2A2A4A] rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-[#1E1E3A]">
                  <span className="text-[#E0E0FF]">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-4 text-[#B0B0DA]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>

      {/* Footer */}
        <Footer/>
    </div>
  )
}