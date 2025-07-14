"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Briefcase, Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate password reset email
    setTimeout(() => {
      if (email) {
        setSuccess(true)
      } else {
        setError("Please enter a valid email address")
      }
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center">
              <Briefcase className="h-8 w-8 text-red-500" />
              <span className="ml-2 text-xl font-bold text-white">AI JobPortal</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/jobs" className="text-gray-300 hover:text-white transition-colors">
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
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl">Reset Your Password</CardTitle>
              <CardDescription className="text-gray-400">
                Enter your email address and we'll send you a link to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!success ? (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="pl-10 bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert className="border-red-500 bg-red-900/20">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <AlertDescription className="text-red-200">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700 text-white">
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <Alert className="border-green-500 bg-green-900/20">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-200">
                      Password reset link has been sent to {email}. Please check your inbox and follow the instructions.
                    </AlertDescription>
                  </Alert>
                  <p className="text-gray-400 text-sm">
                    Didn't receive the email? Check your spam folder or{" "}
                    <button
                      onClick={() => {
                        setSuccess(false)
                        setEmail("")
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      try again
                    </button>
                  </p>
                </div>
              )}

              <div className="text-center">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center text-red-400 hover:text-red-300 font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
