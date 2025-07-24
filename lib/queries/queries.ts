import { gql } from 'graphql-request';

// lib/queries.ts
export const GET_ARTICLES = `
  query MyQuery {
    nodeArticles(first: 10) {
      nodes {
        body {
          value
        }
        image {
          url
        }
        title
        path
        id
        tags {
          ... on TermTag {
            id
            name
          }
        }
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
