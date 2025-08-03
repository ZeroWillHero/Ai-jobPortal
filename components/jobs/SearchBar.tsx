"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  loading?: boolean
}

export function SearchBar({ searchTerm, onSearchChange, loading }: SearchBarProps) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search jobs, companies, or keywords..."
          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          value={searchTerm}
          onChange={onSearchChange}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>
    </div>
  )
}
