"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

interface ErrorDisplayProps {
  title: string
  message: string
  showRetry?: boolean
  onRetry?: () => void
  showBackToJobs?: boolean
  showSignIn?: boolean
}

export function ErrorDisplay({ title, message, showRetry, onRetry, showBackToJobs, showSignIn }: ErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Card className="bg-gray-800 border-gray-700 max-w-md">
        <CardHeader>
          <CardTitle className="text-red-500 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">{message}</p>
          <div className="space-y-2">
            {showRetry && onRetry && (
              <Button onClick={onRetry} className="w-full bg-red-600 hover:bg-red-700">
                Try Again
              </Button>
            )}
            {showBackToJobs && (
              <Link href="/jobs" className="block">
                <Button className="w-full bg-red-600 hover:bg-red-700">Back to Jobs</Button>
              </Link>
            )}
            {showSignIn && (
              <Link href="/auth/signin" className="block">
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
