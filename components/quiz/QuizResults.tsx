import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

interface QuizResultsProps {
  score: number
  minScore?: number
}

export function QuizResults({ score, minScore = 70 }: QuizResultsProps) {
  const passed = score >= minScore

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="text-center">
        <CardTitle className="text-white flex items-center justify-center">
          <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
          Quiz Completed!
        </CardTitle>
        <CardDescription className="text-gray-400">Thank you for completing the assessment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-900 p-6 rounded-lg text-center">
          <h3 className="text-white font-semibold mb-4">Your Results</h3>
          <div className="text-4xl font-bold text-red-500 mb-2">{score}%</div>
          <p className="text-gray-400">
            {passed
              ? "Congratulations! You passed the assessment."
              : "Unfortunately, you didn't meet the minimum score requirement."}
          </p>
        </div>

        {passed ? (
          <Alert className="border-green-500 bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-200">
              Your application has been submitted successfully. The hiring team will review your application and contact
              you within 3-5 business days.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-red-500 bg-red-900/20">
            <AlertDescription className="text-red-200">
              Minimum score required: {minScore}%. We encourage you to improve your skills and apply again in the
              future.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4">
          <Link href="/jobs" className="flex-1">
            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
              Browse More Jobs
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button className="w-full bg-red-600 hover:bg-red-700">Back to Home</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
