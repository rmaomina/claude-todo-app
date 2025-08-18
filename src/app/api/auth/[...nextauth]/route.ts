import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, token }: { session: { user?: { id?: string } }; token: { sub?: string } }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt: async ({ user, token }: { user?: { id?: string }; token: { uid?: string } }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/auth/signin',
  },
} as const;

// Next.js 15 App Router에서는 이렇게 export
export async function GET(request: Request) {
  // @ts-expect-error - NextAuth v4와 Next.js 15 호환성 이슈
  return NextAuth(request, authOptions);
}

export async function POST(request: Request) {
  // @ts-expect-error - NextAuth v4와 Next.js 15 호환성 이슈
  return NextAuth(request, authOptions);
}