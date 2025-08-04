"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/common/Navigation"
import { QuizQuestion } from "@/components/quiz/QuizQuestion"
import { QuizNavigation } from "@/components/quiz/QuizNavigation"
import { QuizResults } from "@/components/quiz/QuizResults"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { 
  generateQuestions, 
  setAnswer, 
  nextQuestion, 
  previousQuestion,
  selectQuestions,
  selectCurrentQuestion,
  selectCurrentQuestionIndex,
  selectAnswers,
  selectQuestionsLoading,
  selectQuestionsError,
  selectTopic,
  selectTotalQuestions,
  selectQuizProgress,
  resetQuiz
} from "@/redux/features/questionSlice"

export default function QuizPage() {
  const params = useParams()
  const dispatch = useAppDispatch()
  
  // Redux selectors
  const questions = useAppSelector(selectQuestions)
  const currentQuestion = useAppSelector(selectCurrentQuestion)
  const currentQuestionIndex = useAppSelector(selectCurrentQuestionIndex)
  const answers = useAppSelector(selectAnswers)
  const loading = useAppSelector(selectQuestionsLoading)
  const error = useAppSelector(selectQuestionsError)
  const topic = useAppSelector(selectTopic)
  const totalQuestions = useAppSelector(selectTotalQuestions)
  const progress = useAppSelector(selectQuizProgress)

  // Local state
  const [timeLeft, setTimeLeft] = useState(3600) // 60 minutes in seconds
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [quizStarted, setQuizStarted] = useState(false)

  // Get topic from localStorage or URL params
  useEffect(() => {
    const initializeQuiz = () => {
      // Try to get topic from localStorage (from application state)
      const applicationState = localStorage.getItem('applicationState')
      let quizTopic = 'javascript begginers' // default topic
      
      if (applicationState) {
        try {
          const parsedState = JSON.parse(applicationState)
          // You can set topic based on job requirements or CV analysis
          quizTopic = parsedState.topic || 'javascript begginers'
        } catch (error) {
          console.error('Error parsing application state:', error)
        }
      }

      // Reset quiz state and generate new questions
      dispatch(resetQuiz())
      dispatch(generateQuestions(quizTopic))
      setQuizStarted(true)
    }

    if (!quizStarted) {
      initializeQuiz()
    }
  }, [dispatch, quizStarted])

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && questions.length > 0) {
      handleSubmitQuiz()
    }
  }, [timeLeft, quizCompleted, questions.length])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (questionId: number, answer: any) => {
    dispatch(setAnswer({ questionId, answer }))
  }

  const handleNext = () => {
    dispatch(nextQuestion())
  }

  const handlePrevious = () => {
    dispatch(previousQuestion())
  }

  const handleSubmitQuiz = () => {
    // Calculate score
    let correctAnswers = 0
    let totalMCQQuestions = 0
    let totalCodeQuestions = 0
    
    questions.forEach((question) => {
      if (question.type === "mcq") {
        totalMCQQuestions++
        if (answers[question.id] === question.correct) {
          correctAnswers++
        }
      } else if (question.type === "code") {
        totalCodeQuestions++
        if (answers[question.id] && answers[question.id].trim().length > 0) {
          // Simplified code evaluation - give partial credit for any attempt
          correctAnswers += 0.8
        }
      }
    })

    const finalScore = Math.round((correctAnswers / questions.length) * 100)
    setScore(finalScore)
    setQuizCompleted(true)

    // Save results to localStorage
    const applicationState = localStorage.getItem('applicationState')
    if (applicationState) {
      try {
        const parsedState = JSON.parse(applicationState)
        const updatedState = {
          ...parsedState,
          quizScore: finalScore,
          quizCompleted: true,
          answers: answers
        }
        localStorage.setItem('applicationState', JSON.stringify(updatedState))
      } catch (error) {
        console.error('Error saving quiz results:', error)
      }
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Generating your personalized quiz...</p>
          <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md">
            <h2 className="text-red-400 text-xl font-semibold mb-2">Quiz Generation Failed</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // No questions loaded yet
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">Preparing your quiz...</p>
        </div>
      </div>
    )
  }

  // Quiz completed
  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <QuizResults 
              score={score || 0} 
              totalQuestions={totalQuestions}
              topic={topic || 'Assessment'}
            />
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
              <h1 className="text-2xl font-bold text-white">
                {topic ? `${topic} Assessment` : 'Assessment Quiz'}
              </h1>
              <span className="text-gray-400">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Display current question */}
          {currentQuestion && (
            <QuizQuestion
              question={currentQuestion}
              currentQuestionIndex={currentQuestionIndex}
              answer={answers[currentQuestion.id]}
              onAnswerChange={handleAnswerChange}
            />
          )}

          <QuizNavigation
            currentQuestion={currentQuestionIndex}
            totalQuestions={totalQuestions}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmitQuiz}
            canGoNext={currentQuestionIndex < totalQuestions - 1}
            canGoPrevious={currentQuestionIndex > 0}
            isLastQuestion={currentQuestionIndex === totalQuestions - 1}
          />
        </div>
      </div>
    </div>
  )
}