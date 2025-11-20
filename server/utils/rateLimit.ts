type Bucket = { count: number; resetAt: number }

const globalBuckets: Record<string, Bucket> = (globalThis as any).__rateBuckets__ || ((globalThis as any).__rateBuckets__ = {})

export async function rateLimit(event: any, key: string, limit: number, windowMs: number) {
  const ip = getRequestIP(event) || 'unknown'
  const bucketKey = `${key}:${ip}`
  const now = Date.now()
  const bucket = globalBuckets[bucketKey] || { count: 0, resetAt: now + windowMs }

  if (now > bucket.resetAt) {
    bucket.count = 0
    bucket.resetAt = now + windowMs
  }

  bucket.count += 1
  globalBuckets[bucketKey] = bucket

  if (bucket.count > limit) {
    throw createError({ statusCode: 429, statusMessage: 'Quá nhiều yêu cầu, thử lại sau.' })
  }
}

function getRequestIP(event: any): string | undefined {
  try {
    // Nitro stores IP in x-forwarded-for or node req
    const hdr = getRequestHeader(event, 'x-forwarded-for')
    if (hdr) return hdr.split(',')[0].trim()
    const ip = (event.node?.req as any)?.socket?.remoteAddress || (event.node?.req as any)?.connection?.remoteAddress
    return ip
  } catch {
    return undefined
  }
}
