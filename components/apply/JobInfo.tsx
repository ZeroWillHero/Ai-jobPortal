interface Job {
  job_title: string
  description: string
  cv_score?: number
  quiz_score?: number
}

interface JobInfoProps {
  job: Job
}

export function JobInfo({ job }: JobInfoProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-2">{job.job_title}</h1>
      <p className="text-gray-400 mb-4">{job.description}</p>
      <div className="flex gap-4 text-sm">
        <span className="text-gray-500">Required CV Score: {job.cv_score || 75}</span>
        <span className="text-gray-500">Required Quiz Score: {job.quiz_score || 70}</span>
      </div>
    </div>
  )
}
