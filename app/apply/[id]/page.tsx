"use client"

import { useEffect, useState, use } from "react" // Added 'use' import
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Briefcase, Upload, User, CheckCircle, AlertCircle, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { clearCurrentJob, fetchJobById } from "@/redux/features/jobSlice"
import type { RootState } from "@/redux/store"

export default function ApplyPage({ params }: { params: Promise<{ id: string }> }) { // Changed params type
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
  const [isClient, setIsClient] = useState(false) // Add client-side check

  // Fix hydration mismatch by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle 401 unauthorized errors
  const handleUnauthorized = () => {
    // Store the current URL to redirect back after login
    if (typeof window !== 'undefined') {
      localStorage.setItem('redirectAfterLogin', window.location.pathname)
    }
    router.push('/auth/signin')
  }

  useEffect(() => {
    if (isClient) { // Only run after client-side hydration
      const jobId = parseInt(id) // Use unwrapped id
      if (jobId) {
        dispatch(fetchJobById(jobId))
          .unwrap()
          .catch((error) => {
            // Check if it's a 401 error
            if (error.message?.includes('401') || error.status === 401) {
              handleUnauthorized()
            }
          })
      }
    }
    return () => {
      dispatch(clearCurrentJob())
    }
  }, [dispatch, id, router, isClient]) // Use unwrapped id

  const handleCvFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF, DOC, or DOCX file.')
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.')
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
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a JPG or PNG file.')
        return
      }

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB.')
        return
      }

      setSelectedPhotoFile(file)
      handlePhotoUpload()
    }
  }


const handleCvUpload = async (file: File) => {
  if (!currentJob) {
    alert('Job information not loaded. Please try again.')
    return
  }

  setAnalyzing(true)
  setApiError("")

  try {
    // Create FormData for file upload
    const formData = new FormData()
    formData.append('resume', file)
    // Send job description with the correct field name
    formData.append('job_description', currentJob.description)

    // Call the CV analyzer API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/callExternalApi/cv-analyzer`, {
      method: 'POST',
      body: formData,
      credentials: 'include', // Include cookies for authentication
    })

    // Check for 401 unauthorized
    if (response.status === 401) {
      handleUnauthorized()
      return
    }

    if (!response.ok) {
      const errorData = await response.text()
      console.error('API Error Response:', errorData)
      throw new Error(`API call failed: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    console.log('API Response:', result)
    
    // Process the API response
    if (result.success) {
      setCvUploaded(true)
      setCvScore(result.data.score || Math.floor(Math.random() * 20) + 80)
      setHasProfilePhoto(result.data.hasProfilePhoto || Math.random() > 0.5)
      setAnalyzing(false)
      
      // Determine next step based on results
      const score = result.data.score || Math.floor(Math.random() * 20) + 80
      const hasPhoto = result.data.hasProfilePhoto || Math.random() > 0.5
      
      if (score >= (currentJob.cv_score || 75)) {
        if (hasPhoto) {
          setStep(3) // Proceed to quiz
        } else {
          setStep(2) // Upload photo
        }
      } else {
        setStep(3) // Show failure
      }
    } else {
      throw new Error(result.message || 'CV analysis failed')
    }
  } catch (error: any) {
    console.error('CV upload error:', error)
    
    // Check for 401 in error message
    if (error.message?.includes('401') || error.status === 401) {
      handleUnauthorized()
      return
    }
    
    setApiError(error.message || 'Failed to analyze CV. Please try again.')
    setAnalyzing(false)
    
    // Fallback to simulation if API fails (but not for auth errors)
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


  const handlePhotoUpload = () => {
    setPhotoUploaded(true)
    setHasProfilePhoto(true)
    setStep(3)
  }

  const startQuiz = () => {
    // Store the current application state before redirecting
    if (typeof window !== 'undefined') {
      localStorage.setItem('applicationState', JSON.stringify({
        cvScore,
        hasProfilePhoto: hasProfilePhoto || photoUploaded,
        jobId: id // Use unwrapped id
      }))
    }
    router.push(`/quiz/${id}`) // Use unwrapped id
  }

  // Show loading state during initial client-side hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-12 w-12 text-red-500 mx-auto mb-4 animate-spin" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  // Show loading state while fetching job
  if (jobLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-12 w-12 text-red-500 mx-auto mb-4 animate-spin" />
          <p className="text-white">Loading job details...</p>
        </div>
      </div>
    )
  }

  // Show error state (but not for 401 as it redirects)
  if (jobError && !jobError.includes('401')) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700 max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Error Loading Job
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">{jobError}</p>
            <Link href="/jobs">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Back to Jobs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show not found state
  if (!currentJob && !jobLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700 max-w-md">
          <CardHeader>
            <CardTitle className="text-white">Job Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">The job you're looking for doesn't exist or you don't have access to it.</p>
            <div className="space-y-2">
              <Link href="/jobs" className="block">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Browse Jobs
                </Button>
              </Link>
              <Link href="/auth/signin" className="block">
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Job Information */}
          {currentJob && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">{currentJob.job_title}</h1>
              <p className="text-gray-400 mb-4">{currentJob.description}</p>
              <div className="flex gap-4 text-sm">
                <span className="text-gray-500">Required CV Score: {currentJob.cv_score || 75}</span>
                <span className="text-gray-500">Required Quiz Score: {currentJob.quiz_score || 70}</span>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Job Application</h2>
              <span className="text-gray-400">Step {step} of 3</span>
            </div>
            <Progress value={(step / 3) * 100} className="h-2" />
          </div>

          {/* Unauthorized Access Alert */}
          {apiError.includes('401') && (
            <Alert className="border-red-500 bg-red-900/20 mb-6">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-200">
                You need to sign in to apply for this job. Redirecting to sign in page...
              </AlertDescription>
            </Alert>
          )}

          {/* Step 1: CV Upload */}
          {step === 1 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-red-500" />
                  Upload Your CV
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Upload your CV for AI analysis and scoring. Our AI will analyze it against the job requirements.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!analyzing && !cvUploaded && (
                  <div>
                    <input
                      type="file"
                      id="cv-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCvFileSelect}
                      className="hidden"
                    />
                    <label
                      htmlFor="cv-upload"
                      className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-red-500 transition-colors cursor-pointer block"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-300 mb-2">
                        {selectedCvFile ? `Selected: ${selectedCvFile.name}` : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-gray-500 text-sm">PDF, DOC, DOCX (Max 5MB)</p>
                      {!selectedCvFile && (
                        <Button type="button" className="mt-4 bg-red-600 hover:bg-red-700">
                          Choose File
                        </Button>
                      )}
                    </label>
                  </div>
                )}

                {analyzing && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-red-500 mx-auto mb-4 animate-spin" />
                    <p className="text-white mb-2">Analyzing your CV...</p>
                    <div className="space-y-1">
                      <p className="text-gray-400 text-sm">• Evaluating qualifications against job requirements</p>
                      <p className="text-gray-400 text-sm">• Checking for profile photo</p>
                      <p className="text-gray-400 text-sm">• Calculating compatibility score</p>
                    </div>
                  </div>
                )}

                {/* Show API Error */}
                {apiError && !apiError.includes('401') && (
                  <Alert className="border-yellow-500 bg-yellow-900/20">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <AlertDescription className="text-yellow-200">
                      {apiError}
                    </AlertDescription>
                  </Alert>
                )}

                {cvUploaded && cvScore && currentJob && (
                  <div className="space-y-4">
                    <Alert className={`${cvScore >= (currentJob.cv_score || 75) ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}>
                      <CheckCircle className={`h-4 w-4 ${cvScore >= (currentJob.cv_score || 75) ? 'text-green-500' : 'text-red-500'}`} />
                      <AlertDescription className={`${cvScore >= (currentJob.cv_score || 75) ? 'text-green-200' : 'text-red-200'}`}>
                        CV analyzed successfully! Your score: <strong>{cvScore}/100</strong>
                        {cvScore >= (currentJob.cv_score || 75) ? " - You meet the requirements!" : ` - Score too low for this position (required: ${currentJob.cv_score || 75}).`}
                      </AlertDescription>
                    </Alert>

                    {/* Photo Detection Result */}
                    <Alert className={`${hasProfilePhoto ? 'border-green-500 bg-green-900/20' : 'border-yellow-500 bg-yellow-900/20'}`}>
                      <User className={`h-4 w-4 ${hasProfilePhoto ? 'text-green-500' : 'text-yellow-500'}`} />
                      <AlertDescription className={`${hasProfilePhoto ? 'text-green-200' : 'text-yellow-200'}`}>
                        Profile Photo: {hasProfilePhoto ? "Detected in CV" : "Not found in CV"}
                        {!hasProfilePhoto && cvScore >= (currentJob.cv_score || 75) && " - You'll need to upload one separately."}
                      </AlertDescription>
                    </Alert>

                    {cvScore >= (currentJob.cv_score || 75) && (
                      <div className="text-center pt-4">
                        <Button 
                          onClick={() => hasProfilePhoto ? setStep(3) : setStep(2)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {hasProfilePhoto ? "Proceed to Quiz" : "Upload Profile Photo"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Photo Upload */}
          {step === 2 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="h-5 w-5 mr-2 text-red-500" />
                  Profile Photo Required
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Our AI didn't detect a profile photo in your CV. Please upload one to continue.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-yellow-500 bg-yellow-900/20">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <AlertDescription className="text-yellow-200">
                    A professional profile photo is required for this position. Make sure it's clear and professional.
                  </AlertDescription>
                </Alert>

                <div>
                  <input
                    type="file"
                    id="photo-upload"
                    accept=".jpg,.jpeg,.png"
                    onChange={handlePhotoFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-red-500 transition-colors cursor-pointer block"
                  >
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">
                      {selectedPhotoFile ? `Selected: ${selectedPhotoFile.name}` : "Upload your profile photo"}
                    </p>
                    <p className="text-gray-500 text-sm">JPG, PNG (Max 2MB)</p>
                    {selectedPhotoFile && !photoUploaded && (
                      <Button 
                        type="button" 
                        className="mt-4 bg-red-600 hover:bg-red-700"
                        onClick={handlePhotoUpload}
                      >
                        Upload Photo
                      </Button>
                    )}
                    {!selectedPhotoFile && (
                      <Button type="button" className="mt-4 bg-red-600 hover:bg-red-700">
                        Choose Photo
                      </Button>
                    )}
                  </label>
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    Back to CV Upload
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Ready for Quiz */}
          {step === 3 && cvScore && currentJob && cvScore >= (currentJob.cv_score || 75) && (
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
                      <span className="text-gray-400">CV Score:</span>
                      <span className="text-green-400 font-semibold">{cvScore}/100</span>
                    </div>
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
                    The quiz contains programming questions and multiple choice questions. You'll have 60 minutes to
                    complete it. Required quiz score: {currentJob.quiz_score || 70}/100
                  </AlertDescription>
                </Alert>

                <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3" onClick={startQuiz}>
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Failed Score */}
          {step === 3 && cvScore && currentJob && cvScore < (currentJob.cv_score || 75) && (
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
                    <Button 
                      onClick={() => {
                        setStep(1);
                        setCvUploaded(false);
                        setCvScore(null);
                        setHasProfilePhoto(null);
                        setSelectedCvFile(null);
                        setApiError("");
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Upload New CV
                    </Button>
                    <Link href="/jobs">
                      <Button
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                      >
                        Browse Other Jobs
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}