import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"
import Link from "next/link"

interface NavigationProps {
  currentPage?: string
  showTimer?: boolean
  timeLeft?: number
  formatTime?: (seconds: number) => string
}

export function Navigation({ currentPage, showTimer, timeLeft, formatTime }: NavigationProps) {
  return (
    <nav className="border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Briefcase className="h-8 w-8 text-red-500" />
            <span className="ml-2 text-xl font-bold text-white">AI JobPortal</span>
          </Link>
          <div className="flex items-center space-x-4">
            {showTimer && timeLeft && formatTime && (
              <div className="flex items-center text-white">
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            )}
            {!showTimer && (
              <>
                <Link
                  href="/jobs"
                  className={`transition-colors ${
                    currentPage === "jobs" ? "text-red-500 font-medium" : "text-gray-300 hover:text-white"
                  }`}
                >
                  Jobs
                </Link>
                <Link href="/auth/signin">
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
