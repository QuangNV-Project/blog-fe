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

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-8rem)] p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">About Us</h1>
            <p className="text-muted-foreground">
              Learn more about our blog and mission
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>
                Building modern web applications with the latest technologies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                This is a demonstration Next.js 16 application showcasing the
                App Router, Server Components, and modern React patterns.
              </p>
              <p>
                We use industry-standard tools and libraries to create fast,
                scalable, and maintainable applications.
              </p>
              <Button asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}

