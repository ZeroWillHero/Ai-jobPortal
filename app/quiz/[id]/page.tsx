"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/common/Navigation"
import { QuizQuestion } from "@/components/quiz/QuizQuestion"
import { QuizNavigation } from "@/components/quiz/QuizNavigation"
import { QuizResults } from "@/components/quiz/QuizResults"

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
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <QuizResults score={score || 0} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation showTimer={true} timeLeft={timeLeft} formatTime={formatTime} />

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

          <QuizQuestion
            question={question}
            currentQuestionIndex={currentQuestion}
            answer={answers[question.id]}
            onAnswerChange={handleAnswerChange}
          />

          <QuizNavigation
            currentQuestion={currentQuestion}
            totalQuestions={quizQuestions.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmitQuiz}
          />
        </div>
      </div>
    </div>
  )
}
