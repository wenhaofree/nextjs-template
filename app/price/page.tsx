'use client'

import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Globe, LinkIcon, Languages, CreditCard } from 'lucide-react'
import { useAuth, SignInButton } from "@clerk/nextjs"

export default function PricePage() {
  const { isSignedIn } = useAuth()

  const handleGetNow = (planName: string) => {
    if (isSignedIn) {
      // 已登录，处理购买逻辑
      console.log(`Processing purchase for plan: ${planName}`)
      // TODO: 实现购买逻辑
    }
  }

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
      name: "免费提交",
      price: "0",
      originalPrice: "0",
      description: "将我们的反向链接添加到您的网站并获得免费提交",
      features: [
        "7 天内添加到列表",
        "提交包含我们反向链接的工具网站",
        "您的工具页面的出站链接是 dofollow",
        "您的工具的链接永久存在",
      ],
    },
    {
      name: "一次性提交",
      price: "16.9",
      originalPrice: "19.9",
      description: "提交一次，无需担心将续扣费",
      features: [
        "48 小时内添加到列表",
        "提交1个AI工具",
        "您可以多次购买",
        "您的工具页面的出站链接是 dofollow",
        "您的工具的链接永久存在",
        "未使用可退款",
        "随时使用",
      ],
    },
    {
      name: "无限提交AI",
      price: "24.9",
      originalPrice: "39.9",
      description: "每月无限次提交AI工具，比一次性提交更划算",
      features: [
        "24小时内添加到列表",
        "无限次提交AI工具",
        "纳入建议列表",
        "您可以更新您的产品信息",
        "您的工具页面的出站链接是 dofollow",
        "您的工具的链接永久存在",
        "您可以在任何时候取消",
      ],
    },
    {
      name: "赞助",
      price: "39.9",
      originalPrice: "59.9",
      description: "成为我们的赞助商并向顶部推荐您的产品 到处都是赞助链接",
      features: [
        "24小时内添加到列表",
        "无限提交AI工具",
        "纳入建议列表",
        "您的工具会出现在更多页面上",
        "您可以更新您的产品信息",
        "赞助商独特的标志和推荐",
        "专家单独交流",
        "您的工具页面的出站链接是 dofollow",
        "您的工具的链接永久存在",
        "您可以在任何时候取消",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#7B68EE] to-[#4169E1]">
            在 AI With Me 上发布您的工具
          </h1>
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

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <Card key={index} className="bg-[#12122A] border-[#2A2A4A] p-6 flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#7B68EE] mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-3xl font-bold text-[#7B68EE]">$</span>
                  <span className="text-4xl font-bold text-[#7B68EE]">{plan.price}</span>
                  {plan.originalPrice !== "0" && (
                    <span className="ml-2 text-[#B0B0DA] line-through">${plan.originalPrice}</span>
                  )}
                </div>
                <p className="text-[#B0B0DA] text-sm">{plan.description}</p>
              </div>
              <div className="flex-grow">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-[#32CD32] mr-2 flex-shrink-0" />
                      <span className="text-sm text-[#B0B0DA]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {isSignedIn ? (
                <Button 
                  className="w-full bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#0A0A1B]"
                  onClick={() => handleGetNow(plan.name)}
                >
                  Get Now
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button 
                    className="w-full bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#0A0A1B]"
                  >
                    Get Now
                  </Button>
                </SignInButton>
              )}
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}