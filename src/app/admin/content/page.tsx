import Link from 'next/link'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ADMIN_CONTENT_TYPES,
  adminContentTypeLabel,
} from '@/lib/admin-content-type'
import { Newspaper, Code2, Images } from 'lucide-react'

const icons = {
  news: Newspaper,
  programming: Code2,
  gallery: Images,
} as const

export default function AdminContentHubPage() {
  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content admin</h1>
        <p className="mt-2 text-muted-foreground">
          Choose a section to manage posts and categories.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {ADMIN_CONTENT_TYPES.map((type) => {
          const Icon = icons[type]
          return (
            <Link key={type} href={`/admin/content/${type}/posts`}>
              <Card className="h-full transition-shadow hover:shadow-md border-border/60">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>{adminContentTypeLabel(type)}</CardTitle>
                  <CardDescription>
                    Posts and categories for {type}.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
