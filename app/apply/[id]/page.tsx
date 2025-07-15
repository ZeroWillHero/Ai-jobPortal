"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Briefcase, Upload, User, CheckCircle, AlertCircle, Clock } from "lucide-react"
import Link from "next/link"

export default function ApplyPage({ params }: { params: { id: string } }) {
  const [step, setStep] = useState(1)
  const [cvUploaded, setCvUploaded] = useState(false)
  const [photoUploaded, setPhotoUploaded] = useState(false)
  const [cvScore, setCvScore] = useState<number | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [selectedCvFile, setSelectedCvFile] = useState<File | null>(null)
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null)

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
      handleCvUpload()
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

  const handleCvUpload = () => {
    setAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setCvUploaded(true)
      setCvScore(Math.floor(Math.random() * 20) + 80) // Random score between 80-100
      setAnalyzing(false)
      // Check if photo is needed (simulate random requirement)
      if (Math.random() > 0.5) {
        setStep(2)
      } else {
        setStep(3)
      }
    }, 3000)
  }

  const handlePhotoUpload = () => {
    setPhotoUploaded(true)
    setStep(3)
  }

  const startQuiz = () => {
    window.location.href = `/quiz/${params.id}`
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
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-white">Job Application</h1>
              <span className="text-gray-400">Step {step} of 3</span>
            </div>
            <Progress value={(step / 3) * 100} className="h-2" />
          </div>

          {/* Step 1: CV Upload */}
          {step === 1 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-red-500" />
                  Upload Your CV
                </CardTitle>
                <CardDescription className="text-gray-400">Upload your CV for AI analysis and scoring</CardDescription>
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
                    <p className="text-gray-400 text-sm">Our AI is evaluating your qualifications</p>
                  </div>
                )}

                {cvUploaded && cvScore && (
                  <Alert className="border-green-500 bg-green-900/20">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-200">
                      CV analyzed successfully! Your score: <strong>{cvScore}/100</strong>
                      {cvScore >= 75 ? " - You meet the requirements!" : " - Score too low for this position."}
                    </AlertDescription>
                  </Alert>
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
                  Your CV is missing a profile photo. Please upload one to continue.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-yellow-500 bg-yellow-900/20">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <AlertDescription className="text-yellow-200">
                    A professional profile photo is required for this position.
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
                    {!selectedPhotoFile && (
                      <Button type="button" className="mt-4 bg-red-600 hover:bg-red-700">
                        Choose Photo
                      </Button>
                    )}
                  </label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Ready for Quiz */}
          {step === 3 && cvScore && cvScore >= 75 && (
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
                      <span className="text-gray-400">Profile Photo:</span>
                      <span className="text-green-400">✓ Uploaded</span>
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
                    complete it.
                  </AlertDescription>
                </Alert>

                <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3" onClick={startQuiz}>
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Failed Score */}
          {step === 3 && cvScore && cvScore < 75 && (
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
                    Minimum score required: 75/100. Your score: {cvScore}/100
                  </AlertDescription>
                </Alert>

                <div className="text-center">
                  <p className="text-gray-300 mb-4">Don't give up! Here are some suggestions:</p>
                  <ul className="text-gray-400 text-sm space-y-1 mb-6">
                    <li>• Update your CV with more relevant experience</li>
                    <li>• Add certifications and skills</li>
                    <li>• Include quantifiable achievements</li>
                  </ul>
                  <Link href="/jobs">
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                    >
                      Browse Other Jobs
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
