
async function cachingMiddleware({ request }: { request: Request }, next : () => Promise<Response>) {
    const cache = (caches as any).default as Cache
    
    const match = await cache.match(request)

    if (match !== undefined) return match

    const response = await next()
    
    if (response.ok && response.headers.has('Cache-Control'))
        cache.put(request, response.clone()).catch(_ => _)
}

export const onRequest =
    typeof globalThis.CacheStorage === 'function' && globalThis.caches instanceof globalThis.CacheStorage
        ? cachingMiddleware
        : (_, next) => next()
