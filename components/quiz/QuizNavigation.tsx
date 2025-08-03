"use client"

import { Button } from "@/components/ui/button"

interface QuizNavigationProps {
  currentQuestion: number
  totalQuestions: number
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
}

export function QuizNavigation({ currentQuestion, totalQuestions, onPrevious, onNext, onSubmit }: QuizNavigationProps) {
  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentQuestion === 0}
        className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
      >
        Previous
      </Button>

      <div className="flex gap-4">
        {currentQuestion === totalQuestions - 1 ? (
          <Button onClick={onSubmit} className="bg-red-600 hover:bg-red-700 text-white">
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={onNext} className="bg-red-600 hover:bg-red-700 text-white">
            Next
          </Button>
        )}
      </div>
    </div>
  )
}
