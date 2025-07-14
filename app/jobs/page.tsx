import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Briefcase, MapPin, Clock, Search, Filter } from "lucide-react"
import Link from "next/link"

const jobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    description:
      "We're looking for a senior frontend developer with expertise in React and TypeScript to join our growing team.",
    requiredScore: 85,
    salary: "$120k - $160k",
    posted: "2 days ago",
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Remote",
    type: "Full-time",
    description:
      "Join our innovative startup as a full stack engineer. Work with modern technologies and shape the future of our product.",
    requiredScore: 80,
    salary: "$100k - $140k",
    posted: "1 week ago",
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "DataFlow Solutions",
    location: "New York, NY",
    type: "Full-time",
    description:
      "Seeking a data scientist to analyze complex datasets and build machine learning models for our clients.",
    requiredScore: 90,
    salary: "$130k - $170k",
    posted: "3 days ago",
  },
  {
    id: 4,
    title: "Backend Developer",
    company: "CloudTech",
    location: "Austin, TX",
    type: "Contract",
    description:
      "Backend developer needed for cloud infrastructure projects. Experience with AWS and microservices required.",
    requiredScore: 75,
    salary: "$90k - $120k",
    posted: "5 days ago",
  },
  {
    id: 5,
    title: "UI/UX Designer",
    company: "DesignStudio",
    location: "Los Angeles, CA",
    type: "Full-time",
    description: "Creative UI/UX designer to work on cutting-edge digital products. Portfolio review required.",
    requiredScore: 70,
    salary: "$80k - $110k",
    posted: "1 day ago",
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "InfraTech",
    location: "Seattle, WA",
    type: "Full-time",
    description: "DevOps engineer to manage CI/CD pipelines and cloud infrastructure. Kubernetes experience preferred.",
    requiredScore: 85,
    salary: "$110k - $150k",
    posted: "4 days ago",
  },
]

export default function JobsPage() {
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
            />
          </div>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="bg-gray-800 border-gray-700 hover:border-red-500 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-white text-lg">{job.title}</CardTitle>
                  <Badge variant="secondary" className="bg-red-900 text-red-200">
                    Score: {job.requiredScore}+
                  </Badge>
                </div>
                <CardDescription className="text-gray-400">{job.company}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-400 text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {job.type} • {job.posted}
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">{job.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-red-400 font-semibold">{job.salary}</span>
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
      </div>
    </div>
  )
}
