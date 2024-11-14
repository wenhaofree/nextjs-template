'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function SearchBar() {
  return (
    <div className="max-w-2xl mx-auto relative">
      <Input
        placeholder="输入任意内容，使用AI提高效率，如：智能剪辑AI工具"
        className="pl-10 py-6 bg-[#1E1E3A] border-[#3A3A5A] text-[#E0E0FF] placeholder-[#8080AA]"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8080AA]" />
      <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#0A0A1B]">
        搜索
      </Button>
    </div>
  )
} 