import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/config/env'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const BACKEND = env.BACK_END_URL

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
])

async function proxyRequest(req: NextRequest, pathSegments: string[]) {
  const segments = pathSegments.filter(Boolean)
  if (segments.length === 0) {
    return NextResponse.json({ error: 'Missing path' }, { status: 400 })
  }
  for (const s of segments) {
    if (s === '..' || s.includes('\0')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }
  }

  const path = segments.map((s) => encodeURIComponent(s)).join('/')
  const target = new URL(`${BACKEND}/${path}`)
  req.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.append(key, value)
  })

  const cookieStore = await cookies()
  const access = cookieStore.get('access-token')?.value
  const incomingAuth = req.headers.get('authorization')

  const headers = new Headers()
  const contentType = req.headers.get('content-type')
  if (contentType) headers.set('content-type', contentType)
  const accept = req.headers.get('accept')
  if (accept) headers.set('accept', accept)

  if (env.TENANT_CODE) {
    headers.set('X-Tenant-Code', env.TENANT_CODE)
  }
  if (access) {
    headers.set('Authorization', `Bearer ${access}`)
  } else if (incomingAuth) {
    headers.set('Authorization', incomingAuth)
  }

  const method = req.method
  const init: RequestInit = {
    method,
    headers,
    cache: 'no-store',
    redirect: 'manual',
  }

  if (!['GET', 'HEAD'].includes(method)) {
    const body = await req.arrayBuffer()
    if (body.byteLength > 0) {
      init.body = body
    }
  }

  let upstream: Response
  try {
    upstream = await fetch(target.toString(), init)
  } catch (e) {
    console.error('[api/proxy] upstream fetch failed', e)
    return NextResponse.json({ error: 'Upstream unavailable' }, { status: 502 })
  }

  const outHeaders = new Headers(upstream.headers)
  for (const name of HOP_BY_HOP) {
    outHeaders.delete(name)
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: outHeaders,
  })
}

type RouteCtx = { params: Promise<{ path: string[] }> }

export async function GET(req: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params
  return proxyRequest(req, path)
}

export async function POST(req: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params
  return proxyRequest(req, path)
}

export async function PUT(req: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params
  return proxyRequest(req, path)
}

export async function PATCH(req: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params
  return proxyRequest(req, path)
}

export async function DELETE(req: NextRequest, ctx: RouteCtx) {
  const { path } = await ctx.params
  return proxyRequest(req, path)
}
