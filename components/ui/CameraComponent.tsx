// components/CameraVerification.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VerificationResult {
  user_present: boolean;
  confidence: number;
  message: string;
  stability_score: number;
  eyes_detected?: boolean;
}

interface CameraVerificationProps {
  onVerificationChange: (isVerified: boolean, confidence: number) => void;
  isQuizActive: boolean;
  verificationInterval?: number; // ms
}

const CameraVerification: React.FC<CameraVerificationProps> = ({
  onVerificationChange,
  isQuizActive,
  verificationInterval = 3000
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isInitialized, setIsInitialized] = useState(false);
  const [referenceSet, setReferenceSet] = useState(false);
  const [currentVerification, setCurrentVerification] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      setError(null);
      
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      streamRef.current = stream;
      setCameraPermission('granted');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsInitialized(true);
        };
      }
    } catch (err) {
      console.error('Camera initialization error:', err);
      setCameraPermission('denied');
      setError('Camera access denied. Please allow camera permission to continue.');
    }
  }, []);

  // Capture frame from video
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  // Set reference image
  const setReferenceImage = useCallback(async () => {
    const frameData = captureFrame();
    if (!frameData) {
      setError('Failed to capture frame');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/set-reference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: frameData }),
      });

      const result = await response.json();
      
      if (result.success) {
        setReferenceSet(true);
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to set reference image');
      console.error('Reference setting error:', err);
    }
  }, [captureFrame, API_BASE_URL]);

  // Verify user presence
  const verifyPresence = useCallback(async () => {
    const frameData = captureFrame();
    if (!frameData) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/verify-presence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: frameData }),
      });

      const result = await response.json();
      setCurrentVerification(result);
      onVerificationChange(result.user_present, result.confidence);
    } catch (err) {
      console.error('Verification error:', err);
      setCurrentVerification({
        user_present: false,
        confidence: 0,
        message: 'Verification failed',
        stability_score: 0
      });
      onVerificationChange(false, 0);
    }
  }, [captureFrame, onVerificationChange, API_BASE_URL]);

  // Start continuous verification
  const startVerification = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(verifyPresence, verificationInterval);
  }, [verifyPresence, verificationInterval]);

  // Stop verification
  const stopVerification = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Cleanup camera
  const cleanupCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsInitialized(false);
  }, []);

  // Effects
  useEffect(() => {
    return () => {
      stopVerification();
      cleanupCamera();
    };
  }, [stopVerification, cleanupCamera]);

  useEffect(() => {
    if (isQuizActive && referenceSet && isInitialized) {
      startVerification();
    } else {
      stopVerification();
    }
  }, [isQuizActive, referenceSet, isInitialized, startVerification, stopVerification]);

  const getStatusColor = () => {
    if (!currentVerification) return 'bg-gray-500';
    if (currentVerification.user_present) {
      return currentVerification.confidence > 0.7 ? 'bg-green-500' : 'bg-yellow-500';
    }
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (!isInitialized) return 'Initializing...';
    if (!referenceSet) return 'Set reference image first';
    if (!currentVerification) return 'Monitoring...';
    return currentVerification.message;
  };

  return (
    <div className="space-y-4">
      {/* Camera Feed */}
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full max-w-md mx-auto border rounded-lg"
          autoPlay
          muted
          playsInline
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Status Indicator */}
        <div className="absolute top-2 right-2 flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
          <span className="text-sm bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            {currentVerification?.confidence ? 
              `${Math.round(currentVerification.confidence * 100)}%` : 
              'N/A'
            }
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col space-y-2">
        {!isInitialized ? (
          <Button onClick={initializeCamera} className="w-full">
            Start Camera
          </Button>
        ) : !referenceSet ? (
          <Button onClick={setReferenceImage} className="w-full">
            Set Reference Image
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              onClick={setReferenceImage}
              variant="outline"
              className="flex-1"
            >
              Update Reference
            </Button>
            <Button
              onClick={cleanupCamera}
              variant="destructive"
              className="flex-1"
            >
              Stop Camera
            </Button>
          </div>
        )}
      </div>

      {/* Status Display */}
      <Alert>
        <AlertDescription>
          <div className="space-y-1">
            <div><strong>Status:</strong> {getStatusText()}</div>
            {currentVerification && (
              <>
                <div><strong>Stability:</strong> {Math.round(currentVerification.stability_score * 100)}%</div>
                {currentVerification.eyes_detected !== undefined && (
                  <div><strong>Eyes Detected:</strong> {currentVerification.eyes_detected ? 'Yes' : 'No'}</div>
                )}
              </>
            )}
          </div>
        </AlertDescription>
      </Alert>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Camera Permission Prompt */}
      {cameraPermission === 'denied' && (
        <Alert variant="destructive">
          <AlertDescription>
            Camera access is required for user verification. Please enable camera permission in your browser settings.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CameraVerification;
