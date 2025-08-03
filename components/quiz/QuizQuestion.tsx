"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Code } from "lucide-react"

interface Question {
  id: number
  type: string
  question: string
  options?: string[]
  placeholder?: string
}

interface QuizQuestionProps {
  question: Question
  currentQuestionIndex: number
  answer: any
  onAnswerChange: (questionId: number, answer: any) => void
}

export function QuizQuestion({ question, currentQuestionIndex, answer, onAnswerChange }: QuizQuestionProps) {
  return (
    <Card className="bg-gray-800 border-gray-700 mb-8 select-none" onContextMenu={(e) => e.preventDefault()}>
      <CardHeader>
        <CardTitle className="text-white flex items-center select-none">
          {question.type === "code" ? (
            <Code className="h-5 w-5 mr-2 text-red-500" />
          ) : (
            <span className="w-5 h-5 mr-2 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {currentQuestionIndex + 1}
            </span>
          )}
          {question.type === "code" ? "Coding Question" : "Multiple Choice"}
        </CardTitle>
        <CardDescription className="text-gray-400 select-none">{question.question}</CardDescription>
      </CardHeader>
      <CardContent onContextMenu={(e) => e.preventDefault()}>
        {question.type === "mcq" ? (
          <RadioGroup
            value={answer?.toString()}
            onValueChange={(value) => onAnswerChange(question.id, Number.parseInt(value))}
            className="select-none"
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 select-none">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-gray-300 cursor-pointer select-none">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="space-y-4">
            <Textarea
              placeholder={question.placeholder}
              value={answer || ""}
              onChange={(e) => onAnswerChange(question.id, e.target.value)}
              className="min-h-[200px] bg-gray-900 border-gray-600 text-white font-mono text-sm"
              onContextMenu={(e) => e.preventDefault()}
            />
            <p className="text-gray-400 text-sm select-none">
              Write your code in the text area above. Make sure your solution is complete and functional.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
