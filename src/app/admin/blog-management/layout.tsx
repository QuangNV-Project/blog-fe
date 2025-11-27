import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function BlogAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-8rem)]">{children}</main>
      <Footer />
    </>
  )
}

