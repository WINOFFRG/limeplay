import { generate as DefaultImage } from 'fumadocs-ui/og';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';

import { PROD_BASE_HOST } from '@/lib/constants';
import { getPageImage, source } from '@/lib/source';

export const revalidate = false;

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));
}

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    <DefaultImage description={page.data.description} site={PROD_BASE_HOST} title={page.data.title} />,
    {
      height: 630,
      width: 1200,
    },
  );
}
