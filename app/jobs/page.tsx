"use client"
import { useEffect, useState, useCallback } from "react"
import type React from "react"

import { fetchAllJobs } from "@/redux/features/jobSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import type { RootState } from "@/redux/store"
import { Navigation } from "@/components/common/Navigation"
import { SearchBar } from "@/components/jobs/SearchBar"
import { JobCard } from "@/components/jobs/JobCard"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { ErrorDisplay } from "@/components/common/ErrorDisplay"
import { EmptyJobsState } from "@/components/jobs/EmptyJobsState"

export default function JobsPage() {
  const dispatch = useAppDispatch()
  const { jobs, loading, error } = useAppSelector((state: RootState) => state.jobs)
  const [searchTerm, setSearchTerm] = useState("")

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      dispatch(fetchAllJobs(term))
    }, 500),
    [dispatch],
  )

  // Initial load
  useEffect(() => {
    dispatch(fetchAllJobs(""))
  }, [dispatch])

  // Search when searchTerm changes
  useEffect(() => {
    debouncedSearch(searchTerm)
  }, [searchTerm, debouncedSearch])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`
  }

  const handleRetry = () => {
    dispatch(fetchAllJobs(searchTerm))
  }

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation currentPage="jobs" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Find Your Dream Job</h1>
          <p className="text-gray-400">Discover opportunities that match your skills and aspirations</p>
        </div>

        <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} loading={loading} />

        {/* Loading State */}
        {loading && (
          <LoadingSpinner
            message={searchTerm ? `Searching for "${searchTerm}"...` : "Loading amazing opportunities..."}
            submessage="Please wait while we fetch the latest jobs for you"
            variant="loader"
          />
        )}

        {/* Error State */}
        {error && !loading && (
          <ErrorDisplay title="Oops! Something went wrong" message={error} showRetry={true} onRetry={handleRetry} />
        )}

        {/* Job Cards */}
        {!loading && !error && Array.isArray(jobs) && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} formatDate={formatDate} />
            ))}
          </div>
        )}

        {/* No Jobs State */}
        {!loading && !error && (!Array.isArray(jobs) || jobs.length === 0) && (
          <EmptyJobsState searchTerm={searchTerm} onClearSearch={handleClearSearch} />
        )}
      </div>
    </div>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
