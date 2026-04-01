import { redirect } from 'next/navigation'

export default function LegacyBlogCreateRedirect() {
  redirect('/admin/content/programming/posts/new')
}
