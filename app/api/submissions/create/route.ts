import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createTool } from '@/app/lib/api/submissions'
import { getToolsDB } from '@/lib/db/neon'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req)
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { name, url, userPlan } = body

    if (!name || !url) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const toolsDB = await getToolsDB()

    // 避免重复创建
    const existingTool = await toolsDB.getToolByTitle(name)
    if (existingTool) {
      return NextResponse.json(existingTool)
    }

    const newTool = await createTool({
      name,
      url,
      userId,
      userPlan
    })

    return NextResponse.json(newTool)

  } catch (error) {
    console.error('[SUBMISSIONS_CREATE]', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 