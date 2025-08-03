"use client"

import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"

interface EmptyJobsStateProps {
  searchTerm: string
  onClearSearch: () => void
}

export function EmptyJobsState({ searchTerm, onClearSearch }: EmptyJobsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Briefcase className="h-16 w-16 text-gray-600 mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">
        {searchTerm ? `No jobs found for "${searchTerm}"` : "No Jobs Available"}
      </h3>
      <p className="text-gray-400 text-center max-w-md">
        {searchTerm
          ? "Try adjusting your search terms or check back later for new opportunities."
          : "We couldn't find any job opportunities at the moment. Check back later or adjust your search criteria."}
      </p>
      {searchTerm && (
        <Button
          onClick={onClearSearch}
          variant="outline"
          className="mt-4 border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
        >
          Clear Search
        </Button>
      )}
    </div>
  )
}
