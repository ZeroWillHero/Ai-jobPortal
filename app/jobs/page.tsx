'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Briefcase, MapPin, Clock, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useCallback } from "react"
import { fetchAllJobs } from "@/redux/features/jobSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import type { RootState } from "@/redux/store"

export default function JobsPage() {
  const dispatch = useAppDispatch();
  const { jobs, loading, error } = useAppSelector((state: RootState) => state.jobs);
  const [searchTerm, setSearchTerm] = useState("");

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      dispatch(fetchAllJobs(term));
    }, 500),
    [dispatch]
  );

  // Initial load
  useEffect(() => {
    dispatch(fetchAllJobs(""));
  }, [dispatch]);

  // Search when searchTerm changes
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

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
              <Link href="/jobs" className="text-red-500 font-medium">
                Jobs
              </Link>
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Find Your Dream Job</h1>
          <p className="text-gray-400">Discover opportunities that match your skills and aspirations</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search jobs, companies, or keywords..."
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-red-500 mb-4" />
            <p className="text-white text-lg">
              {searchTerm ? `Searching for "${searchTerm}"...` : "Loading amazing opportunities..."}
            </p>
            <p className="text-gray-400 text-sm mt-2">Please wait while we fetch the latest jobs for you</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 max-w-md text-center">
              <div className="text-red-400 text-lg font-semibold mb-2">Oops! Something went wrong</div>
              <p className="text-red-300 mb-4">{error}</p>
              <Button 
                onClick={() => dispatch(fetchAllJobs(searchTerm))}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Job Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(jobs) && jobs.map((job) => (
              <Card key={job.id} className="bg-gray-800 border-gray-700 hover:border-red-500 transition-colors">
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
            ))}
          </div>
        )}

        {/* No Jobs State */}
        {!loading && !error && (!Array.isArray(jobs) || jobs.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16">
            <Briefcase className="h-16 w-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? `No jobs found for "${searchTerm}"` : "No Jobs Available"}
            </h3>
            <p className="text-gray-400 text-center max-w-md">
              {searchTerm 
                ? "Try adjusting your search terms or check back later for new opportunities."
                : "We couldn't find any job opportunities at the moment. Check back later or adjust your search criteria."
              }
            </p>
            {searchTerm && (
              <Button 
                onClick={() => setSearchTerm("")}
                variant="outline"
                className="mt-4 border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}