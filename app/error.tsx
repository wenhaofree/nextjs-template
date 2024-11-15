'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, RefreshCw } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 可以选择将错误记录到错误报告服务
    console.error('Error:', error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          出现了一些问题
        </h1>
        <p className="text-muted-foreground max-w-[600px] text-lg">
          抱歉，服务器处理您的请求时遇到了错误。我们已记录此问题并将尽快修复。
        </p>
      </div>

      <div className="flex gap-4">
        <Button 
          onClick={() => reset()}
          className="gap-2"
          aria-label="重试"
        >
          <RefreshCw className="h-4 w-4" />
          重试
        </Button>

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

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 max-w-[600px] rounded-lg bg-muted p-4 text-left text-sm">
          <p className="font-medium">错误详情：</p>
          <p className="text-muted-foreground mt-2 break-words font-mono">
            {error.message || '未知错误'}
          </p>
        </div>
      )}
    </div>
  )
} 