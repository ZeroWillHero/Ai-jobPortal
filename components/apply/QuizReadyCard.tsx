"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

interface QuizReadyCardProps {
  cvScore: number
  atsScore: number
  detailedScores: any
  currentJob: any
  onStartQuiz: () => void
}

export function QuizReadyCard({ cvScore, atsScore, detailedScores, currentJob, onStartQuiz }: QuizReadyCardProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
          Ready for Assessment
        </CardTitle>
        <CardDescription className="text-gray-400">
          Your application has been processed. Take the quiz to complete your application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-900 p-6 rounded-lg">
          <h3 className="text-white font-semibold mb-4">Application Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Overall CV Score:</span>
              <span className="text-green-400 font-semibold">{cvScore}/100</span>
            </div>
            {detailedScores && (
              <div className="flex justify-between">
                <span className="text-gray-400">ATS Compatibility:</span>
                <span className="text-blue-400 font-semibold">{atsScore}%</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Required Score:</span>
              <span className="text-gray-400">{currentJob.cv_score || 75}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Profile Photo:</span>
              <span className="text-green-400">✓ Available</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="text-green-400">Qualified for Quiz</span>
            </div>
          </div>
        </div>

        <Alert className="border-blue-500 bg-blue-900/20">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-200">
            The quiz contains programming questions and multiple choice questions. You'll have 60 minutes to complete
            it. Required quiz score: {currentJob.quiz_score || 70}/100
          </AlertDescription>
        </Alert>

        <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3" onClick={onStartQuiz}>
          Start Quiz
        </Button>
      </CardContent>
    </Card>
  )
}
