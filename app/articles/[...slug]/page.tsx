// app/articles/[...slug]/page.tsx
import { graphQLClient } from '@/lib/graphql-client';
import { GET_ARTICLE_DETAIL } from '@/lib/queries/queries';
import { notFound } from "next/navigation";

type Params = { slug: string[] };

export default async function ArticleDetailPage({ params }: { params: Params }) {
  const path = `/articles/${params.slug.join("/")}`;
  const data = await graphQLClient.request(GET_ARTICLE_DETAIL, { path });
  const entity = data?.route?.entity;

  if (!entity && entity.__typename !== "NodeArticle") {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{entity.title}</h1>

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
