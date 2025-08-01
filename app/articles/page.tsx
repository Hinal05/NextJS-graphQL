import Link from 'next/link';
import { graphQLClient } from '@/lib/graphql-client';
import { GET_ARTICLES } from '@/lib/queries/queries';
import { buildBreadcrumbs } from '@/lib/utility/buildBreadcrumbs';

type SearchParams = { after?: string };

export default async function ArticlesPage({ searchParams }: { searchParams: SearchParams }) {
  const { after = null } = searchParams;
  const { nodeArticles } = await graphQLClient.request(GET_ARTICLES, { first: 3, after });
  const articles = nodeArticles.edges.filter(({ node }: any) => node.status);

  return (
    <div className="p-6">
      <Breadcrumbs />
      <Header />
      <ArticleGrid articles={articles} />
      <Pagination pageInfo={nodeArticles.pageInfo} />
    </div>
  );
}

function Breadcrumbs() {
  const breadcrumbs = buildBreadcrumbs('/articles');
  return (
    <nav className="text-sm text-gray-600 mb-4">
      {breadcrumbs.map((crumb, i) => (
        <span key={i}>
          <Link href={crumb.href} className="text-blue-600 hover:underline">{crumb.label}</Link>
          {i < breadcrumbs.length - 1 && <span className="mx-1">/</span>}
        </span>
      ))}
    </nav>
  );
}

function Header() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">All Articles</h1>
      <Link href="/articles/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block mb-6">
        + Create New Article
      </Link>
    </>
  );
}

function ArticleGrid({ articles }: { articles: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map(({ node }: any) => (
        <Link key={node.id} href={node.path}>
          <div className="border rounded-xl p-4 shadow hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-2">{node.title}</h2>
            {node.image?.url && (
              <img
                src={node.image.url}
                alt={node.image.alt || node.title}
                className="mb-4 rounded w-full h-48 object-cover"
              />
            )}
            <div className="prose" dangerouslySetInnerHTML={{ __html: node.body?.value || '' }} />
            <p className="text-sm text-gray-500">By {node.author?.name}</p>
            {node.tags?.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                Tags: {node.tags.map((tag: any) => tag.name).join(', ')}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

function Pagination({ pageInfo }: { pageInfo: any }) {
  return (
    <div className="mt-8 flex justify-center gap-4">
      {pageInfo.hasPreviousPage && (
        <Link href={`?before=${pageInfo.startCursor}`} className="px-4 py-2 bg-blue-800 rounded hover:bg-blue-700 text-white">
          Previous
        </Link>
      )}
      {pageInfo.hasNextPage && (
        <Link href={`?after=${pageInfo.endCursor}`} className="px-4 py-2 bg-blue-800 rounded hover:bg-blue-700 text-white">
          Next
        </Link>
      )}
    </div>
  );
}