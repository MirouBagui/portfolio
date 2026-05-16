import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { GithubProfileResponse } from './github.types';

interface GraphQlResponse {
  data?: { user?: GithubProfileResponse | null };
  errors?: Array<{ message: string }>;
}

function parseJson<T>(raw: string): T {
  return JSON.parse(raw) as T;
}

const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

const QUERY = `
  query($username: String!) {
    user(login: $username) {
      name
      bio
      avatarUrl
      location
      company
      websiteUrl
      twitterUsername
      pinnedItems(first: 6, types: [REPOSITORY]) {
        totalCount
        edges {
          node {
            ... on Repository {
              id
              name
              description
              url
              homepageUrl
              stargazerCount
              forkCount
              primaryLanguage { name color }
              languages(first: 5) { nodes { name color } }
            }
          }
        }
      }
      repositories(
        first: 20
        orderBy: { field: STARGAZERS, direction: DESC }
        privacy: PUBLIC
        ownerAffiliations: OWNER
      ) {
        nodes {
          id
          name
          description
          url
          stargazerCount
          forkCount
          primaryLanguage { name color }
        }
      }
    }
  }
`;

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  constructor(private readonly configService: ConfigService) {}

  async getProfile(): Promise<GithubProfileResponse | null> {
    const username = this.configService.get<string>(
      'GITHUB_USERNAME',
      'MirouBagui',
    );
    const token = this.configService.get<string>('GITHUB_TOKEN', '');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `bearer ${token}`;
    }

    try {
      const res = await fetch(GITHUB_GRAPHQL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          query: QUERY,
          variables: { username },
        }),
      });

      if (!res.ok) {
        this.logger.error(
          `GitHub API error: ${res.status} ${await res.text()}`,
        );
        return null;
      }

      const text = await res.text();
      const json = parseJson<GraphQlResponse>(text);

      if (json.errors) {
        this.logger.error('GitHub GraphQL errors', JSON.stringify(json.errors));
        return null;
      }

      return json.data?.user ?? null;
    } catch (err) {
      this.logger.error(
        'GitHub fetch failed',
        err instanceof Error ? err.message : err,
      );
      return null;
    }
  }
}
