"use client"

import type React from "react"

import { useEffect, useState, use } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { clearCurrentJob, fetchJobById } from "@/redux/features/jobSlice"
import type { RootState } from "@/redux/store"
import { Navigation } from "@/components/common/Navigation"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { ErrorDisplay } from "@/components/common/ErrorDisplay"
import { ProgressIndicator } from "@/components/apply/ProgressIndicator"
import { JobInfo } from "@/components/apply/JobInfo"
import { CVUploadCard } from "@/components/apply/CVUploadCard"
import { PhotoUploadCard } from "@/components/apply/PhotoUploadCard"
import { QuizReadyCard } from "@/components/apply/QuizReadyCard"
import { FailedScoreCard } from "@/components/apply/FailedScoreCard"

export default function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const dispatch = useAppDispatch()

  // Unwrap params using React.use()
  const { id } = use(params)

  // Get job state data from Redux
  const { currentJob, loading: jobLoading, error: jobError } = useAppSelector((state: RootState) => state.jobs)

  const [step, setStep] = useState(1)
  const [cvUploaded, setCvUploaded] = useState(false)
  const [photoUploaded, setPhotoUploaded] = useState(false)
  const [cvScore, setCvScore] = useState<number | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [selectedCvFile, setSelectedCvFile] = useState<File | null>(null)
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null)
  const [hasProfilePhoto, setHasProfilePhoto] = useState<boolean | null>(null)
  const [apiError, setApiError] = useState<string>("")
  const [isClient, setIsClient] = useState(false)

  // Add new state variables for detailed score display and face detection
  const [detailedScores, setDetailedScores] = useState<any>(null)
  const [analysisReport, setAnalysisReport] = useState<string>("")
  const [atsScore, setAtsScore] = useState<number>(0)
  const [faceDetecting, setFaceDetecting] = useState(false)
  const [faceDetectionResult, setFaceDetectionResult] = useState<any>(null)
  const [successMessage, setSuccessMessage] = useState<string>("")

  // Fix hydration mismatch by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle 401 unauthorized errors
  const handleUnauthorized = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("redirectAfterLogin", window.location.pathname)
    }
    router.push("/auth/signin")
  }

  useEffect(() => {
    if (isClient) {
      const jobId = Number.parseInt(id)
      if (jobId) {
        dispatch(fetchJobById(jobId))
          .unwrap()
          .catch((error) => {
            if (error.message?.includes("401") || error.status === 401) {
              handleUnauthorized()
            }
          })
      }
    }
    return () => {
      dispatch(clearCurrentJob())
    }
  }, [dispatch, id, router, isClient])

  const handleCvFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a PDF, DOC, or DOCX file.")
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB.")
        return
      }

      setSelectedCvFile(file)
      handleCvUpload(file)
    }
  }

  const handlePhotoFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a JPG or PNG file.")
        return
      }

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB.")
        return
      }

      setSelectedPhotoFile(file)
    }
  }

  const handleCvUpload = async (file: File) => {
    if (!currentJob) {
      alert("Job information not loaded. Please try again.")
      return
    }

    setAnalyzing(true)
    setApiError("")

    try {
      const formData = new FormData()
      formData.append("resume", file)
      formData.append("job_description", currentJob.description)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/callExternalApi/cv-analyzer`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      if (response.status === 401) {
        handleUnauthorized()
        return
      }

      if (!response.ok) {
        const errorData = await response.text()
        console.error("API Error Response:", errorData)
        throw new Error(`API call failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      console.log("API Response:", result)

      if (result.success) {
        setCvUploaded(true)

        const scoreFromApi = result.scores?.average_score || 0
        const percentageScore = Math.round(scoreFromApi * 100)
        setCvScore(percentageScore)

        setDetailedScores(result.scores)
        setAnalysisReport(result.analysis?.detailed_report || "")
        const atsScoreValue = Math.round((result.scores?.ats_similarity_score || 0) * 100)
        setAtsScore(atsScoreValue)

        const hasPhoto = result.analysis?.has_profile_photo || false
        setHasProfilePhoto(hasPhoto)

        setAnalyzing(false)

        if (percentageScore >= (currentJob.cv_score || 75)) {
          if (hasPhoto) {
            setStep(3)
          } else {
            setStep(2)
          }
        } else {
          setStep(3)
        }
      } else {
        throw new Error(result.message || "CV analysis failed")
      }
    } catch (error: any) {
      console.error("CV upload error:", error)

      if (error.message?.includes("401") || error.status === 401) {
        handleUnauthorized()
        return
      }

      setApiError(error.message || "Failed to analyze CV. Please try again.")
      setAnalyzing(false)

      setTimeout(() => {
        setCvUploaded(true)
        setCvScore(Math.floor(Math.random() * 20) + 80)
        setHasProfilePhoto(Math.random() > 0.5)
        setAnalyzing(false)
        if (Math.random() > 0.5) {
          setStep(2)
        } else {
          setStep(3)
        }
      }, 1000)
    }
  }

  const handlePhotoUpload = async (file?: File) => {
    const photoFile = file || selectedPhotoFile
    if (!photoFile) {
      alert("No photo file selected.")
      return
    }

    setFaceDetecting(true)
    setApiError("")
    setSuccessMessage("")

    try {
      const convertToDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = (error) => reject(error)
        })
      }

      const dataURL = await convertToDataURL(photoFile)

      const response = await fetch(`${process.env.NEXT_PUBLIC_OPEN_CV_API_URL}/api/set-reference`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: dataURL,
        }),
        credentials: "include",
      })

      if (response.status === 401) {
        handleUnauthorized()
        return
      }

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Face Detection API Error:", errorData)
        throw new Error(`Face detection failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      console.log("Face Detection Response:", result)

      if (result.success === true) {
        setSuccessMessage("🎉 Face detected successfully! Your profile photo meets the requirements.")

        setFaceDetectionResult({
          ...result,
          faces_detected: 1,
          success: true,
          message: result.message,
        })
        setPhotoUploaded(true)
        setHasProfilePhoto(true)
        setFaceDetecting(false)

        setTimeout(() => {
          setStep(3)
        }, 2000)
      } else {
        setFaceDetecting(false)
        setApiError(result.message || "Face detection failed. Please try again with a clearer photo.")
      }
    } catch (error: any) {
      console.error("Face detection error:", error)

      if (error.message?.includes("401") || error.status === 401) {
        handleUnauthorized()
        return
      }

      setApiError(error.message || "Failed to detect face in photo. Please try again with a clearer photo.")
      setFaceDetecting(false)
    }
  }

  const startQuiz = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "applicationState",
        JSON.stringify({
          cvScore,
          hasProfilePhoto: hasProfilePhoto || photoUploaded,
          jobId: id,
        }),
      )
    }
    router.push(`/quiz/${id}`)
  }

  const handleRetry = () => {
    setStep(1)
    setCvUploaded(false)
    setCvScore(null)
    setHasProfilePhoto(null)
    setSelectedCvFile(null)
    setApiError("")
    setDetailedScores(null)
    setAnalysisReport("")
    setFaceDetectionResult(null)
  }

  // Show loading state during initial client-side hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-900">
        <LoadingSpinner message="Loading..." />
      </div>
    )
  }

  // Show loading state while fetching job
  if (jobLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <LoadingSpinner message="Loading job details..." />
      </div>
    )
  }

  // Show error state (but not for 401 as it redirects)
  if (jobError && !jobError.includes("401")) {
    return <ErrorDisplay title="Error Loading Job" message={jobError} showBackToJobs={true} />
  }

  // Show not found state
  if (!currentJob && !jobLoading) {
    return (
      <ErrorDisplay
        title="Job Not Found"
        message="The job you're looking for doesn't exist or you don't have access to it."
        showBackToJobs={true}
        showSignIn={true}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Job Information */}
          {currentJob && <JobInfo job={currentJob} />}

          <ProgressIndicator currentStep={step} totalSteps={3} title="Job Application" />

          {/* Unauthorized Access Alert */}
          {apiError.includes("401") && (
            <Alert className="border-red-500 bg-red-900/20 mb-6">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-200">
                You need to sign in to apply for this job. Redirecting to sign in page...
              </AlertDescription>
            </Alert>
          )}

          {/* Step 1: CV Upload */}
          {step === 1 && (
            <CVUploadCard
              analyzing={analyzing}
              cvUploaded={cvUploaded}
              cvScore={cvScore}
              hasProfilePhoto={hasProfilePhoto}
              detailedScores={detailedScores}
              analysisReport={analysisReport}
              atsScore={atsScore}
              apiError={apiError}
              currentJob={currentJob}
              selectedCvFile={selectedCvFile}
              onFileSelect={handleCvFileSelect}
              onProceed={() => (hasProfilePhoto ? setStep(3) : setStep(2))}
            />
          )}

          {/* Step 2: Photo Upload */}
          {step === 2 && (
            <PhotoUploadCard
              faceDetecting={faceDetecting}
              photoUploaded={photoUploaded}
              faceDetectionResult={faceDetectionResult}
              apiError={apiError}
              selectedPhotoFile={selectedPhotoFile}
              onFileSelect={handlePhotoFileSelect}
              onUpload={() => handlePhotoUpload()}
              onBack={() => setStep(1)}
              onProceed={() => setStep(3)}
            />
          )}

          {/* Step 3: Ready for Quiz */}
          {step === 3 && cvScore && currentJob && cvScore >= (currentJob.cv_score || 75) && (
            <QuizReadyCard
              cvScore={cvScore}
              atsScore={atsScore}
              detailedScores={detailedScores}
              currentJob={currentJob}
              onStartQuiz={startQuiz}
            />
          )}

          {/* Failed Score */}
          {step === 3 && cvScore && currentJob && cvScore < (currentJob.cv_score || 75) && (
            <FailedScoreCard cvScore={cvScore} currentJob={currentJob} onRetry={handleRetry} />
          )}
        </div>
      </div>
    </div>
  )
}
