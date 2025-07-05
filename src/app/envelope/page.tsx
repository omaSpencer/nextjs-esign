import { DefaultLayout } from '@/layout/default'

export default async function EnvelopePage({
  searchParams,
}: {
  searchParams: Promise<{ url: string }>
}) {
  const { url } = await searchParams

  return (
    <DefaultLayout>
      <iframe src={url} className="h-screen w-full" />
    </DefaultLayout>
  )
}
