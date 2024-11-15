import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          404 - 页面未找到
        </h1>
        <p className="text-muted-foreground max-w-[600px] text-lg">
          抱歉，您访问的页面不存在或已被移除。
        </p>
      </div>
      
      <Button 
        variant="outline" 
        asChild
        className="gap-2"
      >
        <Link 
          href="/"
          aria-label="返回首页"
        >
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>
      </Button>
    </div>
  )
} 