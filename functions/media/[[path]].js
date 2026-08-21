const MIME_TYPES = {
  '.mp4': 'video/mp4',
  '.m4v': 'video/x-m4v',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
}

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

  return parts.join('/')
}

function getContentType(key) {
  const extension = key.slice(key.lastIndexOf('.')).toLowerCase()
  return MIME_TYPES[extension] ?? 'application/octet-stream'
}

function parseRange(header, size) {
  if (!header) return null
  const match = /^bytes=(\d*)-(\d*)$/i.exec(header.trim())
  if (!match) return 'invalid'

  const [, startValue, endValue] = match
  if (!startValue && !endValue) return 'invalid'

  if (!startValue) {
    const suffixLength = Number(endValue)
    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) return 'invalid'
    const length = Math.min(suffixLength, size)
    return { offset: size - length, length }
  }

  const offset = Number(startValue)
  const end = endValue ? Number(endValue) : size - 1
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(end) || offset < 0 || end < offset || offset >= size) {
    return 'invalid'
  }

  return { offset, length: Math.min(end, size - 1) - offset + 1 }
}

export async function onRequest({ request, params, env }) {
  if (!['GET', 'HEAD'].includes(request.method)) {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD' } })
  }

  if (!env.MEDIA) return new Response('Media storage is not configured', { status: 503 })

  const key = toSafePath(params.path)
  if (!key) return new Response('Not Found', { status: 404 })

  const metadata = await env.MEDIA.head(key)
  if (!metadata) return new Response('Not Found', { status: 404 })

  const range = parseRange(request.headers.get('Range'), metadata.size)
  if (range === 'invalid') {
    return new Response('Range Not Satisfiable', {
      status: 416,
      headers: { 'Content-Range': `bytes */${metadata.size}` },
    })
  }

  const headers = new Headers()
  metadata.writeHttpMetadata(headers)
  headers.set('Content-Type', headers.get('Content-Type') ?? getContentType(key))
  headers.set('Accept-Ranges', 'bytes')
  headers.set('ETag', metadata.httpEtag)
  headers.set('Cache-Control', 'public, max-age=31536000, immutable')

  if (request.method === 'HEAD') {
    headers.set('Content-Length', String(metadata.size))
    return new Response(null, { headers })
  }

  const object = await env.MEDIA.get(key, range ? { range } : undefined)
  if (!object) return new Response('Not Found', { status: 404 })

  if (range) {
    headers.set('Content-Length', String(range.length))
    headers.set('Content-Range', `bytes ${range.offset}-${range.offset + range.length - 1}/${metadata.size}`)
  } else {
    headers.set('Content-Length', String(metadata.size))
  }

  return new Response(object.body, { status: range ? 206 : 200, headers })
}
