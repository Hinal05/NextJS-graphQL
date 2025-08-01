import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { createArticle } from '@/lib/api/article';

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  if (!token?.csrfToken) {
    return NextResponse.json({ error: 'Missing CSRF token' }, { status: 401 });
  }

  try {
    const { title, body } = await req.json();
    const article = await createArticle({ title, body }, token.csrfToken);
    return NextResponse.json(article);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}