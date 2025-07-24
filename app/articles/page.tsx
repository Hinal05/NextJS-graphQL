// app/articles/page.tsx
import { graphQLClient } from '@/lib/graphql-client';
import { GET_ARTICLES } from '@/lib/queries/queries';
import Link from 'next/link';

export default async function ArticlesPage() {
  const data = await graphQLClient.request(GET_ARTICLES);
  const articles = data.nodeArticles.nodes;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Articles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: any, index: number) => (
          <Link key={index} href={`${article.path}`}>
            <div className="border rounded-xl p-4 shadow hover:shadow-lg cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              {article.image?.url && (
                <img
                  src={article.image.url}
                  alt={article.title}
                  className="mb-4 rounded w-full h-48 object-cover"
                />
              )}
              <div
                className="prose"
                dangerouslySetInnerHTML={{
                  __html: article.body?.value || '',
                }}
              />
              {article.tags?.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  Tags: {article.tags.map((tag: any) => tag.name).join(', ')}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
