import { Progress } from "@/components/ui/progress"

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  title: string
}

export function ProgressIndicator({ currentStep, totalSteps, title }: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <span className="text-gray-400">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
    </div>
  )
}
