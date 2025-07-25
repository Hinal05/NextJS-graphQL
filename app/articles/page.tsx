import { graphQLClient } from '@/lib/graphql-client';
import { GET_ARTICLES } from '@/lib/queries/queries';
import Link from 'next/link';

type SearchParams = {
  after?: string;
};

export default async function ArticlesPage({ searchParams }: { searchParams: SearchParams }) {
  const pageSize = 3;
  const variables = { first: pageSize, after: searchParams.after || null };

  const data = await graphQLClient.request(GET_ARTICLES, variables);
  const edges = data.nodeArticles.edges.filter(({ node }: any) => node.status === true);
  const pageInfo = data.nodeArticles.pageInfo;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Articles</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {edges.map(({ node }: any) => (
          <Link key={node.id} href={node.path}>
            <div className="border rounded-xl p-4 shadow hover:shadow-lg cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">{node.title}</h2>
              {node.image?.url && (
                <img
                  src={node.image.url}
                  alt={node.image.alt || node.title}
                  className="mb-4 rounded w-full h-48 object-cover"
                />
              )}
              <div
                className="prose"
                dangerouslySetInnerHTML={{
                  __html: node.body?.value || '',
                }}
              />
              <p className="text-sm text-gray-500 mb-2">By {node.author?.name}</p>
              {node.tags?.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  Tags: {node.tags.map((tag: any) => tag.name).join(', ')}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-4">
        {pageInfo.hasPreviousPage && (
          <Link
            href={`?before=${pageInfo.endCursor}`}
            className="px-4 py-2 bg-blue-800 rounded hover:bg-blue-700"
          >
            Previous
          </Link>
          // You can implement 'before' pagination if needed
        )}
        {pageInfo.hasNextPage && (
          <Link
            href={`?after=${pageInfo.endCursor}`}
            className="px-4 py-2 bg-blue-800 rounded hover:bg-blue-700"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
