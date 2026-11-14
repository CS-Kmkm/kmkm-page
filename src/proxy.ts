import { NextRequest, NextResponse } from 'next/server';
import { markdownPages, prefersMarkdown, renderMarkdown, renderMarkdown404, type MarkdownPage } from '@/lib/markdown';

export function proxy(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/(ja|en)(?:\/(.*))?$/);
  if (!match || !['GET', 'HEAD'].includes(request.method)) return NextResponse.next();
  const locale = match[1] as 'ja' | 'en';
  const path = (match[2] ?? '').replace(/\/$/, '');
  if (['privacy', 'terms', 'events'].includes(path)) return NextResponse.next();
  const explicit = path.endsWith('.md');
  const page = explicit ? path.slice(0, -3) : path;
  const known = markdownPages.includes(page as MarkdownPage);
  const flight = request.headers.has('rsc') || request.headers.has('next-router-state-tree')
    || request.headers.has('next-router-prefetch') || request.nextUrl.searchParams.has('_rsc');
  if (flight) return NextResponse.next();
  if (!explicit && /\.[^/]+$/.test(path)) return NextResponse.next();
  const markdown = explicit || prefersMarkdown(request.headers.get('accept'));
  const response = markdown
    ? new NextResponse(request.method === 'HEAD' ? null : known
      ? renderMarkdown(locale, page as MarkdownPage) : renderMarkdown404(locale), {
      status: known ? 200 : 404,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'private, no-store' },
    })
    : NextResponse.next();
  response.headers.set('Vary', 'Accept');
  if (known) {
    const alternate = page ? `/${locale}/${page}.md` : `/${locale}/.md`;
    response.headers.set('Link', `<${alternate}>; rel="alternate"; type="text/markdown"`);
  }
  return response;
}

export const config = { matcher: ['/ja/:path*', '/en/:path*'] };
