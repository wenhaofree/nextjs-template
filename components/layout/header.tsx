import Link from "next/link"
import Image from "next/image"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-900">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/placeholder.svg" alt="Toolify.ai Logo" width={32} height={32} />
            <span className="text-xl font-semibold text-green-400">Toolify.ai</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="#" className="text-sm text-gray-300 hover:text-green-400">
              AI产品
            </Link>
            <Link href="/categories" className="text-sm text-gray-300 hover:text-green-400">
              分类
            </Link>
            <Link href="#" className="text-sm text-gray-300 hover:text-green-400">
              排行榜
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-green-400">
                登录
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-black">
                加入 Toolify
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  )
} 