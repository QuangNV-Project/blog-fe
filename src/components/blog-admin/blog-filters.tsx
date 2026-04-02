'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { BlogFilterParams } from '@/types/blog-management'
import { Category } from '@/types/category'

interface BlogFiltersProps {
  filters: BlogFilterParams
  onFilterChange: (filters: BlogFilterParams) => void
  categories?: Category[]
  /** When set, section filter is hidden and this type is preserved on clear. */
  lockedContentType?: BlogFilterParams['contentType']
}

export function BlogFilters({
  filters,
  onFilterChange,
  categories = [],
  lockedContentType,
}: Readonly<BlogFiltersProps>) {
  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value, page: 1 })
  }

  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filters,
      status: value === 'all' ? undefined : (value as BlogFilterParams['status']),
      page: 1,
    })
  }

  const handleContentTypeChange = (value: string) => {
    onFilterChange({
      ...filters,
      contentType: value === 'all' ? undefined : (value as BlogFilterParams['contentType']),
      category: undefined,
      page: 1,
    })
  }

  const handleCategoryChange = (value: string) => {
    onFilterChange({
      ...filters,
      category: value === 'all' ? undefined : value,
      page: 1,
    })
  }

  const handleClearFilters = () => {
    onFilterChange({
      page: 1,
      limit: filters.limit,
      ...(lockedContentType ? { contentType: lockedContentType } : {}),
    })
  }

  const hasActiveFilters =
    filters.search ||
    filters.status ||
    filters.category ||
    (!lockedContentType && filters.contentType)

  return (
    <div className="space-y-4 p-6 rounded-lg border border-border/40 bg-muted/30">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or content..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 bg-background/60 border-border/60"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status || 'all'}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-full sm:w-[180px] bg-background/60 border-border/60">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        {!lockedContentType && (
          <Select
            value={filters.contentType || 'all'}
            onValueChange={handleContentTypeChange}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-background/60 border-border/60">
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="programming">Programming</SelectItem>
              <SelectItem value="gallery">Gallery</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Category Filter */}
        {categories.length > 0 && (
          <Select
            value={filters.category || 'all'}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-background/60 border-border/60">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearFilters}
            title="Clear filters"
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

