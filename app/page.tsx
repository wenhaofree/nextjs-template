'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Globe, LogIn, ExternalLink, Bot, Music, Mic, Image as ImageIcon, PenSquare, Briefcase, Palette, Shirt, ShoppingBag, Video, MessageSquare, Brain, GamepadIcon, ArrowUp, Sun, Moon } from "lucide-react"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from 'next/image'

export default function Home() {
  const [visibleTools, setVisibleTools] = useState(4)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const categories = [
    { name: "All Tools", icon: null },
    { name: "Free", icon: null },
    { name: "Music", icon: <Music className="w-4 h-4" /> },
    { name: "Voice", icon: <Mic className="w-4 h-4" /> },
    { name: "Audio", icon: <Mic className="w-4 h-4" /> },
    { name: "Picture", icon: <ImageIcon className="w-4 h-4" /> },
    { name: "Writing", icon: <PenSquare className="w-4 h-4" /> },
    { name: "Office", icon: <Briefcase className="w-4 h-4" /> },
    { name: "Design & Art", icon: <Palette className="w-4 h-4" /> },
    { name: "Fashion", icon: <Shirt className="w-4 h-4" /> },
    { name: "Shopping", icon: <ShoppingBag className="w-4 h-4" /> },
    { name: "Video", icon: <Video className="w-4 h-4" /> },
    { name: "Chatbot", icon: <MessageSquare className="w-4 h-4" /> },
    { name: "GPTs", icon: <Brain className="w-4 h-4" /> },
    { name: "Game", icon: <GamepadIcon className="w-4 h-4" /> },
  ]

  const tools = [
    {
      title: "Pokemon TCG Pocket",
      description: "Experience the excitement of Pokemon TCG Pocket – a mobile card game for all fans!",
      category: "Game",
      image: "/placeholder.svg?height=200&width=400",
      features: [
        "Quick and easy gameplay on the go",
        "Build your own deck with unique strategies",
        "Open two FREE booster packs daily",
        "Challenge players worldwide in real-time"
      ],
      isNew: true,
    },
    {
      title: "All Sprunki Phases(1-9)",
      description: "Play all phases of the Sprunki game online for free!",
      category: "Game",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Sprunki",
      description: "Sprunki is a fun and creative music game for everyone.",
      category: "Music",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      title: "Math.bot",
      description: "Math.bot offers instant math solutions powered by AI.",
      category: "Education",
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  const showMore = () => setVisibleTools(prevVisible => prevVisible + 4)

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev)
    document.documentElement.classList.toggle('dark')
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
        <header className="border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link className="flex items-center space-x-2" href="#">
                  <Bot className="w-6 h-6" />
                  <span className="font-semibold">AI With Me</span>
                </Link>
                <nav className="hidden md:flex items-center space-x-6">
                  <Link className="flex items-center space-x-1 text-green-500" href="#">
                    <Bot className="w-4 h-4" />
                    <span>Discover</span>
                  </Link>
                  <Link className="flex items-center space-x-1" href="#">
                    <Bot className="w-4 h-4" />
                    <span>Submit AI</span>
                  </Link>
                  <Link href="#">Pricing</Link>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                  <Globe className="w-5 h-5" />
                </button>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                      <LogIn className="w-5 h-5" />
                      <span>Login</span>
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-4">Discover thousands of AI Tools</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
              Discover the latest and best AI tools for 2024 at AI With Me, let&apos;s explore the trends in AI and make AI work for us.
            </p>
            <div className="flex items-center justify-center text-sm text-green-500 mb-8">
              <Bot className="w-4 h-4 mr-2" />
              <span>Sponsored by Sprunki Incredibox</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </div>
            <input
              className="w-full max-w-xl mx-auto px-4 py-2 rounded-md bg-transparent border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search AI tools for me..."
            />
          </div>

          <div className="w-full mb-8 overflow-x-auto">
            <div className="flex space-x-2 pb-4">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className="flex items-center space-x-2 whitespace-nowrap px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  {category.icon}
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.slice(0, visibleTools).map((tool) => (
              <div key={tool.title} className="overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <div className="relative">
                  <Image
                    alt={tool.title}
                    className="w-full h-48 object-cover"
                    height={200}
                    width={400}
                    src={tool.image}
                  />
                  {tool.isNew && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      NEW!
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {tool.description}
                  </p>
                  {tool.features && (
                    <ul className="space-y-1 mb-4">
                      {tool.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                          <span className="w-1 h-1 bg-blue-500 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <button className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md">
                      {tool.category}
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {visibleTools < tools.length && (
            <div className="text-center mt-8">
              <button
                onClick={showMore}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                Show More
              </button>
            </div>
          )}
        </main>

        <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
          <button
            onClick={toggleTheme}
            className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {isDarkTheme ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}