import { gql } from 'graphql-request';

// lib/queries.ts
export const GET_ARTICLES = gql`
  query GetArticles($first: Int!, $after: Cursor) {
    nodeArticles(first: $first, after: $after, sortKey: CREATED_AT, reverse: true) {
      edges {
        cursor
        node {
          id
          body {
            value
          }
          image {
            url
            title
            alt
          }
          path
          title
          tags {
            ... on TermTag {
              id
              name
            }
          }
          status
          author {
            id
            name
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const GET_ARTICLE_DETAIL = gql`
  query GetArticleDetail($path: String!) {
    route(path: $path) {
      ... on RouteInternal {
        entity {
          ... on NodeArticle {
            id
            title
            status
            path
            image {
              url
              title
              alt
            }
            tags {
              ... on TermTag {
                id
                name
              }
            }
            author {
              name
            }
            body {
              summary
              value
            }
          }
        }
      }
      ... on RouteRedirect {
        url
        status
      }
    }
  }
`;
