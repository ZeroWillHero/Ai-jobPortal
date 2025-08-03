"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

interface FailedScoreCardProps {
  cvScore: number
  currentJob: any
  onRetry: () => void
}

export function FailedScoreCard({ cvScore, currentJob, onRetry }: FailedScoreCardProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
          Application Not Qualified
        </CardTitle>
        <CardDescription className="text-gray-400">
          Unfortunately, your CV score doesn't meet the minimum requirements for this position.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-red-500 bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-200">
            Minimum score required: {currentJob.cv_score || 75}/100. Your score: {cvScore}/100
          </AlertDescription>
        </Alert>

        <div className="text-center">
          <p className="text-gray-300 mb-4">Don't give up! Here are some suggestions:</p>
          <ul className="text-gray-400 text-sm space-y-1 mb-6">
            <li>• Update your CV with more relevant experience</li>
            <li>• Add certifications and skills</li>
            <li>• Include quantifiable achievements</li>
            <li>• Add a professional profile photo</li>
          </ul>
          <div className="space-x-4">
            <Button onClick={onRetry} className="bg-red-600 hover:bg-red-700 text-white">
              Upload New CV
            </Button>
            <Link href="/jobs">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
                Browse Other Jobs
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
