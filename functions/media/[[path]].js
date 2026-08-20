const UPSTREAM_BASE = 'https://gitee.com/xayron/xayron-media/raw/master/videos'

function toSafePath(value) {
  const source = Array.isArray(value) ? value.join('/') : String(value ?? '')
  const parts = source.split('/').filter(Boolean).map((part) => {
    try {
      return decodeURIComponent(part)
    } catch {
      return part
    }
  })

  if (!parts.length || parts.some((part) => (
    part === '.' || part === '..' || part.includes('/') || part.includes('\\')
  ))) return null

  return parts.map(encodeURIComponent).join('/')
}

export async function onRequest({ request, params }) {
  if (!['GET', 'HEAD'].includes(request.method)) {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD' } })
  }

  const path = toSafePath(params.path)
  if (!path) return new Response('Not Found', { status: 404 })

  const requestHeaders = new Headers({ Accept: 'video/*,application/octet-stream;q=0.9,*/*;q=0.5' })
  const range = request.headers.get('Range')
  if (range) requestHeaders.set('Range', range)

  let upstream
  try {
    upstream = await fetch(`${UPSTREAM_BASE}/${path}`, { headers: requestHeaders })
  } catch {
    return new Response('Media source temporarily unavailable', { status: 502 })
  }

  const headers = new Headers()
  for (const name of ['content-type', 'content-length', 'content-range', 'accept-ranges', 'etag', 'last-modified']) {
    const value = upstream.headers.get(name)
    if (value) headers.set(name, value)
  }
  headers.set('Cache-Control', upstream.headers.get('cache-control') ?? 'public, max-age=3600')
  headers.set('Access-Control-Allow-Origin', '*')

  return new Response(request.method === 'HEAD' ? null : upstream.body, {
    status: upstream.status,
    headers,
  })
}
