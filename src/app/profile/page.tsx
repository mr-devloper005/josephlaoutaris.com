import { MagazineTaskListPage } from '@/components/magazine/magazine-task-list-page'
import { buildTaskMetadata } from '@/lib/seo'
import { taskPageMetadata } from '@/config/site.content'

export const revalidate = 3

export const generateMetadata = () =>
  buildTaskMetadata('profile', {
    path: '/profile',
    title: taskPageMetadata.profile.title,
    description: taskPageMetadata.profile.description,
  })

export default async function ProfilePage({ searchParams }: { searchParams?: Promise<{ category?: string }> }) {
  const resolvedParams = await searchParams
  return <MagazineTaskListPage task="profile" category={resolvedParams?.category} />
}
