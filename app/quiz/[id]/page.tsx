"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Briefcase, Clock, Code, CheckCircle } from "lucide-react"
import Link from "next/link"

const quizQuestions = [
  {
    id: 1,
    type: "mcq",
    question: "Which of the following is NOT a JavaScript data type?",
    options: ["String", "Boolean", "Integer", "Undefined"],
    correct: 2,
  },
  {
    id: 2,
    type: "code",
    question: "Write a function that returns the sum of two numbers:",
    placeholder: "function sum(a, b) {\n  // Your code here\n}",
    solution: "function sum(a, b) {\n  return a + b;\n}",
  },
  {
    id: 3,
    type: "mcq",
    question: "What does CSS stand for?",
    options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
    correct: 1,
  },
  {
    id: 4,
    type: "code",
    question: "Create a React component that displays 'Hello World':",
    placeholder:
      "import React from 'react';\n\nfunction HelloWorld() {\n  // Your code here\n}\n\nexport default HelloWorld;",
    solution:
      "import React from 'react';\n\nfunction HelloWorld() {\n  return <div>Hello World</div>;\n}\n\nexport default HelloWorld;",
  },
  {
    id: 5,
    type: "mcq",
    question: "Which HTTP method is used to update a resource?",
    options: ["GET", "POST", "PUT", "DELETE"],
    correct: 2,
  },
]

export default function QuizPage({ params }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: any }>({})
  const [timeLeft, setTimeLeft] = useState(3600) // 60 minutes in seconds
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleSubmitQuiz()
    }
  }, [timeLeft, quizCompleted])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = () => {
    // Calculate score (simplified)
    let correctAnswers = 0
    quizQuestions.forEach((question) => {
      if (question.type === "mcq" && answers[question.id] === question.correct) {
        correctAnswers++
      } else if (question.type === "code" && answers[question.id]) {
        // Simplified code evaluation - in real app, this would be more sophisticated
        correctAnswers += 0.8 // Assume partial credit for code questions
      }
    })

    const finalScore = Math.round((correctAnswers / quizQuestions.length) * 100)
    setScore(finalScore)
    setQuizCompleted(true)
  }

  const question = quizQuestions[currentQuestion]

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gray-900">
        <nav className="border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center">
                <Briefcase className="h-8 w-8 text-red-500" />
                <span className="ml-2 text-xl font-bold text-white">AI JobPortal</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
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
                    {score && score >= 70
                      ? "Congratulations! You passed the assessment."
                      : "Unfortunately, you didn't meet the minimum score requirement."}
                  </p>
                </div>

                {score && score >= 70 ? (
                  <Alert className="border-green-500 bg-green-900/20">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-200">
                      Your application has been submitted successfully. The hiring team will review your application and
                      contact you within 3-5 business days.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-red-500 bg-red-900/20">
                    <AlertDescription className="text-red-200">
                      Minimum score required: 70%. We encourage you to improve your skills and apply again in the
                      future.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-4">
                  <Link href="/jobs" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                    >
                      Browse More Jobs
                    </Button>
                  </Link>
                  <Link href="/" className="flex-1">
                    <Button className="w-full bg-red-600 hover:bg-red-700">Back to Home</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
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
              <div className="flex items-center text-white">
                <Clock className="h-4 w-4 mr-2 text-red-500" />
                <span className="font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
        <div className="max-w-4xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-white">Assessment Quiz</h1>
              <span className="text-gray-400">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
            </div>
            <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="bg-gray-800 border-gray-700 mb-8 select-none" onContextMenu={(e) => e.preventDefault()}>
            <CardHeader>
              <CardTitle className="text-white flex items-center select-none">
                {question.type === "code" ? (
                  <Code className="h-5 w-5 mr-2 text-red-500" />
                ) : (
                  <span className="w-5 h-5 mr-2 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {currentQuestion + 1}
                  </span>
                )}
                {question.type === "code" ? "Coding Question" : "Multiple Choice"}
              </CardTitle>
              <CardDescription className="text-gray-400 select-none">{question.question}</CardDescription>
            </CardHeader>
            <CardContent onContextMenu={(e) => e.preventDefault()}>
              {question.type === "mcq" ? (
                <RadioGroup
                  value={answers[question.id]?.toString()}
                  onValueChange={(value) => handleAnswerChange(question.id, Number.parseInt(value))}
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
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
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

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            >
              Previous
            </Button>

            <div className="flex gap-4">
              {currentQuestion === quizQuestions.length - 1 ? (
                <Button onClick={handleSubmitQuiz} className="bg-red-600 hover:bg-red-700 text-white">
                  Submit Quiz
                </Button>
              ) : (
                <Button onClick={handleNext} className="bg-red-600 hover:bg-red-700 text-white">
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
