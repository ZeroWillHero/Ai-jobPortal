import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-red-500" />
              <span className="ml-2 text-xl font-bold text-white">AI JobPortal</span>
            </div>
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

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-gray-900"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Start Your Career with <span className="text-red-500">AI-Powered Hiring</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Experience the future of job applications with our AI-driven platform. Upload your CV, take intelligent
              assessments, and get matched with your perfect role.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/jobs">
                <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg">
                  Browse Jobs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Why Choose AI JobPortal?</h2>
            <p className="mt-4 text-lg text-gray-300">
              Our platform revolutionizes the hiring process with cutting-edge AI technology
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-gray-900 p-8 shadow-lg border border-gray-800">
                <div className="flex items-center">
                  <Zap className="h-8 w-8 text-red-500" />
                  <h3 className="ml-3 text-xl font-semibold text-white">AI-Powered Matching</h3>
                </div>
                <p className="mt-4 text-gray-300">
                  Our advanced AI analyzes your CV and matches you with the most suitable positions
                </p>
              </div>
              <div className="rounded-lg bg-gray-900 p-8 shadow-lg border border-gray-800">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-red-500" />
                  <h3 className="ml-3 text-xl font-semibold text-white">Smart Assessments</h3>
                </div>
                <p className="mt-4 text-gray-300">
                  Take intelligent quizzes that adapt to your skill level and provide instant feedback
                </p>
              </div>
              <div className="rounded-lg bg-gray-900 p-8 shadow-lg border border-gray-800">
                <div className="flex items-center">
                  <Briefcase className="h-8 w-8 text-red-500" />
                  <h3 className="ml-3 text-xl font-semibold text-white">Real-time Results</h3>
                </div>
                <p className="mt-4 text-gray-300">
                  Get instant CV analysis and quiz results to track your application progress
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Briefcase className="h-6 w-6 text-red-500" />
              <span className="ml-2 text-lg font-semibold text-white">AI JobPortal</span>
            </div>
            <p className="text-gray-400">© 2024 AI JobPortal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
