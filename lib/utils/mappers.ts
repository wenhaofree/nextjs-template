import { DbTool } from '@/lib/db/neon'
import { Tool } from '@/types/tools'

export function mapDbToolToTool(dbTool: DbTool): Tool {
  return {
    id: dbTool.id,
    name: dbTool.title,
    description: dbTool.summary || '',
    imageUrl: dbTool.image_url || '/tools/default.png',
    link: dbTool.url,
    rating: Number(dbTool.rating) || 0,
    categories: dbTool.tags ? dbTool.tags.split(',') : [],
    updateDate: dbTool.updated_at?.toISOString(),
    submitterId: dbTool.submit_user_id?.toString(),
    isPaid: dbTool.price_type !== 'free',
    status: dbTool.status
  }
} 