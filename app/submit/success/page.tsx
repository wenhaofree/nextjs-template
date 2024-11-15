'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { usePlan } from '@/hooks/usePlan'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SubmissionsAPI } from '@/lib/api/submissions'

interface SubmissionData {
  name: string;
  url: string;
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const submissionName = searchParams.get('submission_name')
  const submissionUrl = searchParams.get('submission_url')
  const { user, isLoaded: isUserLoaded } = useUser()
  const { plan, isLoading: isPlanLoading, refreshPlan } = usePlan()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [saveStatus, setSaveStatus] = useState<'pending' | 'success' | 'error'>('pending')

  useEffect(() => {
    const verifyAndSave = async () => {
      // 如果已经成功保存过，就不再重复调用
      if (saveStatus === 'success') return
      
      // 等待用户数据加载完成
      if (!isUserLoaded) return

      // 检查用户是否已登录
      if (!user) {
        setStatus('error')
        return
      }

      try {
        // 即使缺少某些参数，只要有 sessionId，我们也认为支付是成功的
        if (!sessionId) {
          setStatus('error')
          return
        }

        setStatus('success')
        await refreshPlan()
        
        // 只有当有提交信息时才保存
        if (submissionName && submissionUrl) {
          try {
            const result = await SubmissionsAPI.create({
              name: submissionName,
              url: submissionUrl,
              userId: user.id,
              userPlan: plan?.type || 'one-time',
            })
            
            if (result && 'id' in result) {
              setSaveStatus('success')
            } else {
              setSaveStatus('error')
              console.error('Submission creation failed: Invalid response', result)
            }
          } catch (error) {
            console.error('Error saving submission:', error)
            setSaveStatus('error')
          }
        }
      } catch (error) {
        console.error('Error during verification process:', error)
        setSaveStatus('error')
      }
    }

    verifyAndSave()
  }, [sessionId, user, isUserLoaded, submissionName, submissionUrl])

  // 如果用户数据还在加载中，显示加载状态
  if (!isUserLoaded) {
    return (
      <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">加载中...</h1>
            <p className="text-[#B0B0DA]">请稍候</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // 加载中状态
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">处理中...</h1>
            <p className="text-[#B0B0DA]">请稍候，我们正在处理您的提交</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // 支付成功状态
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4 text-[#32CD32]">支付成功！</h1>
            {!isPlanLoading && plan && (
              <p className="text-[#B0B0DA] mb-4">
                您的计划已更新为: {plan.type}
              </p>
            )}
            {submissionName && submissionUrl && (
              <>
                {saveStatus === 'success' && (
                  <p className="text-[#32CD32] mb-8">
                    您的提交 "{submissionName}" 已保存成功！
                  </p>
                )}
                {saveStatus === 'error' && (
                  <p className="text-yellow-500 mb-8">
                    支付成功，但提交保存遇到问题。请联系客服处理。
                  </p>
                )}
              </>
            )}
            <Button asChild>
              <Link href="/submit">继续提交</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // 缺少必要参数的错误状态
  return (
    <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-500">无效的请求</h1>
          <p className="text-[#B0B0DA] mb-8">
            缺少必要的参数，请从正常流程访问此页面
          </p>
          <Button asChild variant="outline">
            <Link href="/submit">返回提交页面</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
} 