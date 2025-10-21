import { XMLParser } from 'fast-xml-parser'

interface RSSItem {
  title: string
  link: string
  description: string
  pubDate: string
  author?: string
  category?: string[]
  guid?: string
}

interface ParsedRSSItem {
  id: string
  title: string
  url: string
  description: string
  publishedDate: string
  author?: string
  category?: string
  image?: string
  source: string
  estimatedReadTime: number
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const feedUrl = searchParams.get('url')

    if (!feedUrl) {
      return Response.json(
        { success: false, error: 'Feed URL is required' },
        { status: 400 }
      )
    }

    // Default RSS feeds if no URL provided
    const defaultFeeds = {
      expo: 'https://blog.expo.dev/feed',
      'react-native': 'https://reactnative.dev/blog/rss.xml',
    }

    const rssUrl = defaultFeeds[feedUrl as keyof typeof defaultFeeds] || feedUrl

    // Fetch RSS feed
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    let rssXml: string
    try {
      const response = await fetch(rssUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'PocketClone RSS Reader 1.0',
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      rssXml = await response.text()
    } catch (error: any) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        return Response.json(
          { success: false, error: 'Request timeout' },
          { status: 408 }
        )
      }
      return Response.json(
        { success: false, error: `Failed to fetch RSS feed: ${error.message}` },
        { status: 500 }
      )
    }

    // Parse RSS XML
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    })

    const parsed = parser.parse(rssXml)

    // Handle different RSS formats (RSS 2.0, Atom, etc.)
    let items: RSSItem[] = []
    let feedTitle = ''

    if (parsed.rss?.channel) {
      // RSS 2.0 format
      items = Array.isArray(parsed.rss.channel.item)
        ? parsed.rss.channel.item
        : [parsed.rss.channel.item].filter(Boolean)
      feedTitle = parsed.rss.channel.title || ''
    } else if (parsed.feed?.entry) {
      // Atom format
      const entries = Array.isArray(parsed.feed.entry)
        ? parsed.feed.entry
        : [parsed.feed.entry].filter(Boolean)

      items = entries.map((entry: any) => ({
        title: entry.title?.['#text'] || entry.title || '',
        link: entry.link?.['@_href'] || entry.link || '',
        description: entry.summary?.['#text'] || entry.summary || '',
        pubDate: entry.published || entry.updated || '',
        author: entry.author?.name || '',
        guid: entry.id || '',
      }))
      feedTitle = parsed.feed.title?.['#text'] || parsed.feed.title || ''
    }

    // Sort items by publication date (newest first)
    const sortedItems = items.sort((a, b) => {
      const dateA = new Date(a.pubDate || '').getTime()
      const dateB = new Date(b.pubDate || '').getTime()
      return dateB - dateA // Newest first
    })

    // Transform items to our format
    const parsedItems: ParsedRSSItem[] = sortedItems
      .slice(0, 20)
      .map((item: RSSItem) => {
        const description = item.description || ''
        const wordCount = description
          .split(/\s+/)
          .filter((word) => word.length > 0).length
        const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200))

        // Extract image from multiple sources
        let image: string | undefined

        // First try: Look for image in description HTML
        const imageMatch = description.match(/<img[^>]+src="([^"]+)"/i)
        if (imageMatch) {
          image = imageMatch[1]
        }

        // Second try: Check for media:content or media:thumbnail in RSS item
        if (!image && (item as any)['media:content']) {
          const mediaContent = Array.isArray((item as any)['media:content'])
            ? (item as any)['media:content'][0]
            : (item as any)['media:content']
          image = mediaContent?.['@_url']
        }

        // Third try: Check for media:thumbnail
        if (!image && (item as any)['media:thumbnail']) {
          const mediaThumbnail = Array.isArray((item as any)['media:thumbnail'])
            ? (item as any)['media:thumbnail'][0]
            : (item as any)['media:thumbnail']
          image = mediaThumbnail?.['@_url']
        }

        // Fourth try: Check for enclosure (podcast-style)
        if (
          !image &&
          (item as any).enclosure &&
          typeof (item as any).enclosure === 'object'
        ) {
          const enclosure = Array.isArray((item as any).enclosure)
            ? (item as any).enclosure[0]
            : (item as any).enclosure
          if (
            enclosure?.['@_type'] &&
            enclosure['@_type'].startsWith('image/')
          ) {
            image = enclosure['@_url']
          }
        }

        // Fifth try: Look for content:encoded which might have images
        if (!image && (item as any)['content:encoded']) {
          const contentMatch = (item as any)['content:encoded'].match(
            /<img[^>]+src="([^"]+)"/i
          )
          if (contentMatch) {
            image = contentMatch[1]
          }
        }

        // Convert date string to ISO format for proper SQL sorting
        let publishedDate = new Date().toISOString()
        if (item.pubDate) {
          try {
            publishedDate = new Date(item.pubDate).toISOString()
          } catch (error) {
            console.warn('Failed to parse date:', item.pubDate)
          }
        }

        return {
          id: item.guid || item.link || `${item.title}-${item.pubDate}`,
          title: item.title || 'Untitled',
          url: item.link || '',
          description: description.replace(/<[^>]*>/g, '').trim(), // Strip HTML tags
          publishedDate,
          author: item.author,
          category: Array.isArray(item.category)
            ? item.category[0]
            : item.category,
          image,
          source: feedTitle,
          estimatedReadTime,
        }
      })

    return Response.json({
      success: true,
      data: {
        feedTitle,
        feedUrl: rssUrl,
        items: parsedItems,
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error('RSS feed parsing error:', error)
    return Response.json(
      { success: false, error: 'Failed to parse RSS feed' },
      { status: 500 }
    )
  }
}
