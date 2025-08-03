"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Briefcase, Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { handleApiCall } from "@/app/api/handleApiCall"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Validation states
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Refs to track previous values
  const prevEmailRef = useRef(email)
  const prevPasswordRef = useRef(password)

  // Clear errors when user starts typing (only if they actually changed the input)
  useEffect(() => {
    if (email && emailError && email !== prevEmailRef.current) {
      setEmailError("")
    }
    prevEmailRef.current = email
  }, [email, emailError])

  useEffect(() => {
    if (password && passwordError && password !== prevPasswordRef.current) {
      setPasswordError("")
    }
    prevPasswordRef.current = password
  }, [password, passwordError])

  // Clear general error when user starts typing (only if they actually changed the input)
  useEffect(() => {
    const emailChanged = email !== prevEmailRef.current
    const passwordChanged = password !== prevPasswordRef.current
    
    if (error && (emailChanged || passwordChanged)) {
      setError("")
    }
  }, [email, password, error])

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError("Email is required")
      return false
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  // Password validation
  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("Password is required")
      return false
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return false
    }
    setPasswordError("")
    return true
  }

   // ...existing code...
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
  
    // Validate inputs before submitting
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
  
    if (!isEmailValid || !isPasswordValid) {
      return
    }
  
    setIsLoading(true)
  
    try {
      const response = await handleApiCall({
        url: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
        method: 'POST',
        data: { email, password },
      })
  
      console.log('API Response:', response) // Debug log
  
      // If we reach here, it means the API call was successful
      // handleApiCall only throws on errors, so if we're here, it's a success
      setSuccess("🎉 Sign in successful! Redirecting to your dashboard...")
      
      // Store authentication data if provided
      if (response.token) {
        localStorage.setItem('authToken', response.token)
      }
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user))
      }
      
      // Check if there's a redirect URL stored
      const redirectUrl = localStorage.getItem('redirectAfterLogin')
      
      setTimeout(() => {
        if (redirectUrl) {
          localStorage.removeItem('redirectAfterLogin')
          router.push(redirectUrl)
        } else {
          router.push("/jobs")
        }
      }, 2000) // Increased to 2 seconds to show the success message longer
  
    } catch (error: any) {
      console.error('Sign in error:', error)
      
      // Since handleApiCall throws error.response?.data || error.message || 'API call failed'
      let errorMessage = "An unexpected error occurred. Please try again."
      
      // Check if the error is a string (from error.response?.data || error.message)
      if (typeof error === 'string') {
        errorMessage = error
      }
      // Check if error is an object with message property
      else if (error && typeof error === 'object') {
        if (error.message) {
          errorMessage = error.message
        }
        // If it's the response data object directly (this is what we expect)
        else if (error.statusCode === 400 && error.message) {
          errorMessage = error.message // This should be "Invalid username or password"
        }
      }
      
      console.log('Setting error message:', errorMessage) // Debug log
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }
  
  // ...existing code...

  // Handle input blur for validation
  const handleEmailBlur = () => {
    if (email) validateEmail(email)
  }

  const handlePasswordBlur = () => {
    if (password) validatePassword(password)
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
              <Link href="/auth/signup">
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                >
                  Sign Up
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
              <CardTitle className="text-white text-2xl">Welcome Back</CardTitle>
              <CardDescription className="text-gray-400">
                Sign in to your account to continue your job search
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Sign In Form */}
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={handleEmailBlur}
                      placeholder="Enter your email"
                      className={`pl-10 bg-gray-900 border-gray-600 text-white placeholder-gray-400 ${
                        emailError ? 'border-red-500 focus:ring-red-500' : ''
                      }`}
                      required
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                  {emailError && (
                    <p className="text-red-400 text-sm mt-1">{emailError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">
                    Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={handlePasswordBlur}
                      placeholder="Enter your password"
                      className={`pl-10 pr-10 bg-gray-900 border-gray-600 text-white placeholder-gray-400 ${
                        passwordError ? 'border-red-500 focus:ring-red-500' : ''
                      }`}
                      required
                      disabled={isLoading}
                      autoComplete="current-password"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 disabled:opacity-50"
                      disabled={isLoading}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-red-400 text-sm mt-1">{passwordError}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-gray-900"
                      disabled={isLoading}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                      Remember me
                    </label>
                  </div>
                  <Link 
                    href="/auth/forgot-password" 
                    className={`text-sm text-red-400 hover:text-red-300 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert className="border-red-500 bg-red-900/20">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-200">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Success Alert */}
                {success && (
                  <Alert className="border-green-500 bg-green-900/20">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-200">{success}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  disabled={isLoading || !email || !password} 
                  className="w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-gray-400">
                  Don't have an account?{" "}
                  <Link 
                    href="/auth/signup" 
                    className={`text-red-400 hover:text-red-300 font-medium ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}