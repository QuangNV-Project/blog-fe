import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'
import { decodeJwtPayload, isAdminFromRoles } from '@/lib/jwt-payload'

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access-token')?.value
  if (token) {
    const payload = decodeJwtPayload(token)
    if (payload?.type !== 'refresh' && isAdminFromRoles(payload?.roles)) {
      redirect('/admin/content')
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-8">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="text-3xl">Welcome to Blog FE</CardTitle>
            <CardDescription>
              A modern Next.js 16 application with App Router
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This project is built with the following technologies:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Next.js 16 with App Router</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>shadcn/ui</li>
              <li>TanStack Query (React Query)</li>
              <li>Zustand for state management</li>
              <li>React Hook Form with Zod validation</li>
            </ul>
            <div className="flex gap-4 pt-4">
              <Button asChild>
                <Link href="/content">Content Hub</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/programming">Programming</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  )
}

