"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, AlertCircle, Clock, CheckCircle } from "lucide-react"

interface PhotoUploadCardProps {
  faceDetecting: boolean
  photoUploaded: boolean
  faceDetectionResult: any
  apiError: string
  selectedPhotoFile: File | null
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
  onUpload: () => void
  onBack: () => void
  onProceed: () => void
}

export function PhotoUploadCard({
  faceDetecting,
  photoUploaded,
  faceDetectionResult,
  apiError,
  selectedPhotoFile,
  onFileSelect,
  onUpload,
  onBack,
  onProceed,
}: PhotoUploadCardProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <User className="h-5 w-5 mr-2 text-red-500" />
          Profile Photo Required
        </CardTitle>
        <CardDescription className="text-gray-400">
          Our AI didn't detect a profile photo in your CV. Please upload one to continue. We'll use OpenCV to detect
          your face.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-yellow-500 bg-yellow-900/20">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-200">
            A professional profile photo is required for this position. Make sure it's clear and professional with your
            face clearly visible.
          </AlertDescription>
        </Alert>

        {faceDetecting && (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-red-500 mx-auto mb-4 animate-spin" />
            <p className="text-white mb-2">Detecting face in your photo...</p>
            <div className="space-y-1">
              <p className="text-gray-400 text-sm">• Analyzing image quality</p>
              <p className="text-gray-400 text-sm">• Detecting facial features</p>
              <p className="text-gray-400 text-sm">• Validating photo requirements</p>
            </div>
          </div>
        )}

        {!faceDetecting && !photoUploaded && (
          <div>
            <input type="file" id="photo-upload" accept=".jpg,.jpeg,.png" onChange={onFileSelect} className="hidden" />
            <label
              htmlFor="photo-upload"
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-red-500 transition-colors cursor-pointer block"
            >
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">
                {selectedPhotoFile ? `Selected: ${selectedPhotoFile.name}` : "Upload your profile photo"}
              </p>
              <p className="text-gray-500 text-sm">JPG, PNG (Max 2MB) • Face detection enabled</p>
              {!selectedPhotoFile && (
                <Button type="button" className="mt-4 bg-red-600 hover:bg-red-700">
                  Choose Photo
                </Button>
              )}
            </label>

            {selectedPhotoFile && !photoUploaded && (
              <div className="mt-4 text-center">
                <Button
                  type="button"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={onUpload}
                  disabled={faceDetecting}
                >
                  {faceDetecting ? "Detecting Face..." : "Upload & Detect Face"}
                </Button>
              </div>
            )}
          </div>
        )}

        {photoUploaded && faceDetectionResult && (
          <Alert className="border-green-500 bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-200">
              <div className="space-y-2">
                <div className="font-semibold">✅ Face Detection Successful!</div>
                <div className="text-sm">
                  <div>• Faces detected: {faceDetectionResult.faces_detected}</div>
                  {faceDetectionResult.confidence && (
                    <div>• Detection confidence: {Math.round(faceDetectionResult.confidence * 100)}%</div>
                  )}
                  {faceDetectionResult.image_quality && <div>• Image quality: {faceDetectionResult.image_quality}</div>}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {apiError && !apiError.includes("401") && (
          <Alert className="border-red-500 bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-200">{apiError}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
            disabled={faceDetecting}
          >
            Back to CV Upload
          </Button>

          {photoUploaded && (
            <Button onClick={onProceed} className="bg-red-600 hover:bg-red-700 text-white">
              Proceed to Quiz
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
