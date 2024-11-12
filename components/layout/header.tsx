import Link from "next/link"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Cpu } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-[#2A2A4A] bg-[#12122A] sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <Cpu className="w-8 h-8 text-[#7B68EE]" />
            <span className="text-xl font-semibold text-[#7B68EE]">Toolify.ai</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="#" className="text-sm text-[#E0E0FF] hover:text-[#7B68EE] transition-colors">
              AI产品
            </Link>
            <Link 
              href="/categories" 
              className="text-sm text-[#E0E0FF] hover:text-[#7B68EE] transition-colors"
            >
              分类
            </Link>
            <Link href="#" className="text-sm text-[#E0E0FF] hover:text-[#7B68EE] transition-colors">
              排行榜
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#E0E0FF] hover:text-[#7B68EE] hover:bg-[#1E1E3A]"
              >
                登录
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button 
                size="sm" 
                className="bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#0A0A1B]"
              >
                加入 Toolify
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                variables: {
                  colorPrimary: '#7B68EE',
                  colorText: '#E0E0FF',
                  colorBackground: '#12122A',
                  colorInputBackground: '#1E1E3A',
                  colorInputText: '#E0E0FF',
                },
                elements: {
                  avatarBox: "w-8 h-8",
                  card: "bg-[#12122A] border-[#2A2A4A]",
                  userButtonPopoverCard: "bg-[#12122A] border-[#2A2A4A]",
                  userButtonPopoverActionButton: "text-[#E0E0FF] hover:text-[#7B68EE] hover:bg-[#1E1E3A]",
                  userButtonPopoverFooter: "border-t border-[#2A2A4A]"
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  )
} 