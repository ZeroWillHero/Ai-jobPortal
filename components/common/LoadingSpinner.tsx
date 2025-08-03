import { Clock, Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  message?: string
  submessage?: string
  size?: "sm" | "md" | "lg"
  variant?: "clock" | "loader"
}

export function LoadingSpinner({
  message = "Loading...",
  submessage,
  size = "md",
  variant = "clock",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  const Icon = variant === "clock" ? Clock : Loader2

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Icon className={`${sizeClasses[size]} text-red-500 mx-auto mb-4 animate-spin`} />
      <p className="text-white text-lg">{message}</p>
      {submessage && <p className="text-gray-400 text-sm mt-2">{submessage}</p>}
    </div>
  )
}
