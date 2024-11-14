import { NextResponse } from 'next/server'
import { getToolsDB } from '@/lib/db/neon'
import { mapDbToolToTool } from '@/lib/utils/mappers'

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const toolsDB = await getToolsDB()
    const dbTools = await toolsDB.getToolsByUser(parseInt(params.userId))
    const tools = dbTools.map(mapDbToolToTool)
    
    return NextResponse.json(tools)
  } catch (error) {
    console.error('Error fetching user tools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user tools' }, 
      { status: 500 }
    )
  }
} 