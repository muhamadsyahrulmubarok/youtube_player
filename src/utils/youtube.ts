export function extractVideoId(input: string): string | null {
  const trimmed = input.trim()

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }

  try {
    const url = new URL(trimmed)

    if (url.hostname === 'youtu.be') {
      return url.pathname.slice(1) || null
    }

    if (
      url.hostname === 'www.youtube.com' ||
      url.hostname === 'youtube.com' ||
      url.hostname === 'm.youtube.com'
    ) {
      if (url.pathname === '/watch') {
        return url.searchParams.get('v')
      }
      const embedMatch = url.pathname.match(/^\/embed\/([a-zA-Z0-9_-]{11})/)
      if (embedMatch) return embedMatch[1]

      const shortsMatch = url.pathname.match(
        /^\/shorts\/([a-zA-Z0-9_-]{11})/,
      )
      if (shortsMatch) return shortsMatch[1]
    }
  } catch {
    // not a valid URL
  }

  return null
}
