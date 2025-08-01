// app/articles/[...slug]/page.tsx
import { graphQLClient } from '@/lib/graphql-client';
import { GET_ARTICLE_DETAIL } from '@/lib/queries/queries';
import { notFound } from "next/navigation";
import { buildBreadcrumbs } from '@/lib/utility/buildBreadcrumbs';
import Link from 'next/link';

type Params = { slug: string[] };

export default async function ArticleDetailPage({ params }: { params: Params }) {
  const path = `/articles/${params.slug.join("/")}`;
  const data = await graphQLClient.request(GET_ARTICLE_DETAIL, { path });
  const entity = data?.route?.entity;

  if (!entity && entity.__typename !== "NodeArticle") {
    notFound();
  }

  const breadcrumbs = buildBreadcrumbs(path);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-600 mb-4">
        {breadcrumbs.map((crumb, i) => (
          <span key={i}>
            <Link href={crumb.href} className="text-blue-600 hover:underline">
              {crumb.label}
            </Link>
            {i < breadcrumbs.length - 1 && <span className="mx-1">/</span>}
          </span>
        ))}
      </nav>
      <h1 className="text-3xl font-bold mb-4">{entity.title}</h1>
      <p className="text-sm text-gray-500 mb-2">By {entity.author?.name}</p>

      {entity.image?.url && (
        <img
          src={entity.image.url}
          alt={entity.title}
          className="rounded mb-4 w-full"
        />
      )}

      <div className="mb-2 text-sm text-gray-600">
        {entity.tags?.map((tag: any) => (
          <span key={tag.id} className="inline-block bg-gray-200 rounded px-2 py-1 mr-2">
            {tag.name}
          </span>
        ))}
      </div>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: entity.body.value }}
      />
    </div>
  );
}