import fs from 'fs/promises'
import path from 'path'

const TOOLS_CONTENT_DIR = path.join(process.cwd(), 'src/content/tools')

export async function getToolContent(slug: string): Promise<string | null> {
  try {
    const filePath = path.join(TOOLS_CONTENT_DIR, `${slug}.md`)
    const content = await fs.readFile(filePath, 'utf-8')
    return content
  } catch (error) {
    console.error(`Error reading markdown file for ${slug}:`, error)
    return null
  }
}

export async function getAllToolSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(TOOLS_CONTENT_DIR)
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''))
  } catch (error) {
    console.error('Error reading tool slugs:', error)
    return []
  }
} 