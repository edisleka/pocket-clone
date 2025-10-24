import { parseWebsiteContent } from '@/utils/server-parser'

export async function POST(request: Request) {
  try {
    const { url } = (await request.json()) as { url: string }

    // Validate URL
    if (!url) {
      return Response.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      )
    }

    let validUrl: URL
    try {
      validUrl = new URL(url)
    } catch {
      return Response.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Fetch HTML content with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    let html: string
    try {
      const response = await fetch(validUrl.toString(), {
        signal: controller.signal as any,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PocketClone/1.0)',
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      html = await response.text()
    } catch (error: any) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        return Response.json(
          { success: false, error: 'Request timeout' },
          { status: 408 }
        )
      }
      return Response.json(
        { success: false, error: `Failed to fetch URL: ${error.message}` },
        { status: 500 }
      )
    }

    // Parse the website content
    const result = await parseWebsiteContent(html, validUrl.toString())

    return Response.json({ success: true, data: result })
  } catch (error: any) {
    console.error('Parse URL error:', error)
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
