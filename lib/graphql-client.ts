// lib/graphql-client.ts
import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_DRUPAL_GRAPHQL_ENDPOINT!;

export const graphQLClient = new GraphQLClient(endpoint, {
  auth: {
    clientId: process.env.NEXT_PUBLIC_DRUPAL_CLIENT_ID!,
    clientSecret: process.env.NEXT_PUBLIC_DRUPAL_CLIENT_SECRET!,
  },
});
