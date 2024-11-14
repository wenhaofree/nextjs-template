import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#7B68EE] mb-4">工具未找到</h1>
        <p className="text-[#B0B0DA] mb-6">
          抱歉，您访问的工具页面不存在。
        </p>
        <Link href="/">
          <Button className="bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#0A0A1B]">
            返回首页
          </Button>
        </Link>
      </div>
    </div>
  )
} 