import { NextResponse } from 'next/server'
import { getToolsDB } from '@/lib/db/neon'
import { Tool } from '@/data/tools'

export async function POST(req: Request) {
  try {
    const tool = await req.json()
    const toolsDB = await getToolsDB()
    const result = await toolsDB.addTool(tool)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error adding tool:', error)
    return NextResponse.json({ error: 'Failed to add tool' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const toolsDB = await getToolsDB()
    
    if (userId) {
      const tools = await toolsDB.getToolsByUser(userId)
      return NextResponse.json(tools)
    }
    
    const tools = await toolsDB.getTools()
    return NextResponse.json(tools)
  } catch (error) {
    console.error('Error fetching tools:', error)
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 })
  }
} 