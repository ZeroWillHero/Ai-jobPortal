import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock } from "lucide-react"
import Link from "next/link"

interface Job {
  id: number
  job_title: string
  description: string
  cv_score: number
  quiz_score: number
  created_at: string
}

interface JobCardProps {
  job: Job
  formatDate: (dateString: string) => string
}

export function JobCard({ job, formatDate }: JobCardProps) {
  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-red-500 transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-white text-lg">{job.job_title}</CardTitle>
          <div className="flex flex-col gap-1">
            <Badge variant="secondary" className="bg-red-900 text-red-200 text-xs">
              CV: {job.cv_score}+
            </Badge>
            <Badge variant="secondary" className="bg-blue-900 text-blue-200 text-xs">
              Quiz: {job.quiz_score}+
            </Badge>
          </div>
        </div>
        <CardDescription className="text-gray-400">AI JobPortal</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-400 text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            Remote
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            Full-time • {formatDate(job.created_at)}
          </div>
        </div>
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{job.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-red-400 font-semibold">Competitive</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/apply/${job.id}`} className="w-full">
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Apply Now</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
