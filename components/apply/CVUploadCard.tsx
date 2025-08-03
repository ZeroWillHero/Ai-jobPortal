"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Clock, CheckCircle, User, AlertCircle } from "lucide-react"

interface CVUploadCardProps {
  analyzing: boolean
  cvUploaded: boolean
  cvScore: number | null
  hasProfilePhoto: boolean | null
  detailedScores: any
  analysisReport: string
  atsScore: number
  apiError: string
  currentJob: any
  selectedCvFile: File | null
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
  onProceed: () => void
}

export function CVUploadCard({
  analyzing,
  cvUploaded,
  cvScore,
  hasProfilePhoto,
  detailedScores,
  analysisReport,
  atsScore,
  apiError,
  currentJob,
  selectedCvFile,
  onFileSelect,
  onProceed,
}: CVUploadCardProps) {
  return (
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
            <input type="file" id="cv-upload" accept=".pdf,.doc,.docx" onChange={onFileSelect} className="hidden" />
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

        {apiError && !apiError.includes("401") && (
          <Alert className="border-yellow-500 bg-yellow-900/20">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-200">{apiError}</AlertDescription>
          </Alert>
        )}

        {cvUploaded && cvScore && currentJob && (
          <div className="space-y-4">
            <Alert
              className={`${cvScore >= (currentJob.cv_score || 75) ? "border-green-500 bg-green-900/20" : "border-red-500 bg-red-900/20"}`}
            >
              <CheckCircle
                className={`h-4 w-4 ${cvScore >= (currentJob.cv_score || 75) ? "text-green-500" : "text-red-500"}`}
              />
              <AlertDescription
                className={`${cvScore >= (currentJob.cv_score || 75) ? "text-green-200" : "text-red-200"}`}
              >
                <div className="space-y-3">
                  <div>
                    <strong>Overall CV Score: {cvScore}/100</strong>
                    {cvScore >= (currentJob.cv_score || 75)
                      ? " - You meet the requirements!"
                      : ` - Score too low for this position (required: ${currentJob.cv_score || 75}).`}
                  </div>

                  {detailedScores && (
                    <div className="mt-3 p-3 bg-gray-800/50 rounded-lg text-sm">
                      <div className="font-semibold mb-2 text-white">📊 Score Breakdown:</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex justify-between">
                          <span className="text-gray-300">ATS Compatibility:</span>
                          <span
                            className={`font-medium ${atsScore >= 70 ? "text-green-400" : atsScore >= 50 ? "text-yellow-400" : "text-red-400"}`}
                          >
                            {atsScore}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Criteria Evaluated:</span>
                          <span className="font-medium text-blue-400">{detailedScores.total_criteria || 0}</span>
                        </div>
                      </div>

                      {detailedScores.individual_scores && detailedScores.individual_scores.length > 0 && (
                        <div className="mt-3">
                          <div className="font-semibold mb-2 text-white">🎯 Individual Criteria:</div>
                          <div className="grid grid-cols-3 gap-2">
                            {detailedScores.individual_scores.map((score: number, index: number) => (
                              <div key={index} className="flex justify-between text-xs bg-gray-700/50 p-1 rounded">
                                <span className="text-gray-400">#{index + 1}:</span>
                                <span
                                  className={`font-medium ${score >= 0.7 ? "text-green-400" : score >= 0.5 ? "text-yellow-400" : "text-red-400"}`}
                                >
                                  {Math.round(score * 100)}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>

            {analysisReport && (
              <Alert className="border-blue-500 bg-blue-900/20">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-200">
                  <div className="space-y-2">
                    <div className="font-semibold flex items-center">
                      <span className="mr-2">🤖</span>
                      AI Analysis Report:
                    </div>
                    <div className="text-sm whitespace-pre-line bg-gray-800/50 p-3 rounded-lg max-h-40 overflow-y-auto border-l-4 border-blue-400">
                      {analysisReport}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Alert
              className={`${hasProfilePhoto ? "border-green-500 bg-green-900/20" : "border-yellow-500 bg-yellow-900/20"}`}
            >
              <User className={`h-4 w-4 ${hasProfilePhoto ? "text-green-500" : "text-yellow-500"}`} />
              <AlertDescription className={`${hasProfilePhoto ? "text-green-200" : "text-yellow-200"}`}>
                Profile Photo: {hasProfilePhoto ? "✅ Detected in CV" : "❌ Not found in CV"}
                {!hasProfilePhoto &&
                  cvScore >= (currentJob.cv_score || 75) &&
                  " - You'll need to upload one separately."}
              </AlertDescription>
            </Alert>

            {cvScore >= (currentJob.cv_score || 75) && (
              <div className="text-center pt-4">
                <Button onClick={onProceed} className="bg-red-600 hover:bg-red-700 text-white">
                  {hasProfilePhoto ? "Proceed to Quiz" : "Upload Profile Photo"}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
