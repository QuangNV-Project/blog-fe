import { redirect } from 'next/navigation'

export default function LegacyBlogManagementRedirect() {
  redirect('/admin/content/programming/posts')
}
