// Web-compatible parsing utilities using linkedom
export async function parseWebsiteContent(html: string, url: string) {
  console.log('START API')

  const { parseHTML } = await import('linkedom')

  const { document } = parseHTML(html) as any
  const validUrl = new URL(url)

  // Helper function to get element content
  const getMetaContent = (selector: string): string => {
    const element = document.querySelector(selector)
    return element?.getAttribute('content') || ''
  }

  const getTextContent = (selector: string): string => {
    const element = document.querySelector(selector)
    return element?.textContent?.trim() || ''
  }

  // Extract basic metadata
  const title =
    getMetaContent('meta[property="og:title"]') ||
    getMetaContent('meta[name="twitter:title"]') ||
    getTextContent('title') ||
    'Untitled'

  const description =
    getMetaContent('meta[property="og:description"]') ||
    getMetaContent('meta[name="twitter:description"]') ||
    getMetaContent('meta[name="description"]') ||
    ''

  const image =
    getMetaContent('meta[property="og:image"]') ||
    getMetaContent('meta[name="twitter:image"]') ||
    ''

  const siteName = getMetaContent('meta[property="og:site_name"]')

  const author =
    getMetaContent('meta[name="author"]') || getTextContent('[rel="author"]')

  // Extract domain
  const domain = validUrl.hostname

  // Simple content extraction using common article selectors
  let articleContent = ''
  let wordCount = 0
  let readingTime = 0

  try {
    // Try common article content selectors + React Native Web patterns
    const contentSelectors = [
      'article',
      '[role="main"]',
      'main',
      '.post-content',
      '.entry-content',
      '.content',
      '.post-body',
      '.article-body',
      '.prose',
      // React Native Web and modern frameworks
      '#root > div > div', // Common React app structure
      '[data-testid="content"]',
      '[data-testid="article"]',
      '.markdown-body',
      // Try finding largest content blocks
      'div[class*="content"]',
      'div[class*="article"]',
      'div[class*="post"]',
      'div[class*="blog"]',
    ]
    // Debug: log available elements
    console.log('Body HTML length:', document.body?.innerHTML?.length || 0)
    console.log(
      'Available classes:',
      Array.from(document.querySelectorAll('[class]'))
        .slice(0, 5)
        .map((el) => (el as any).className)
    )
    console.log(
      'Available IDs:',
      Array.from(document.querySelectorAll('[id]'))
        .slice(0, 5)
        .map((el) => (el as any).id)
    )

    for (const selector of contentSelectors) {
      console.log('🚀 ~ parseWebsiteContent ~ selector:', selector)
      const element = document.querySelector(selector)
      console.log('🚀 ~ parseWebsiteContent ~ element:', element)
      if (element) {
        const textContent = element.textContent?.trim() || ''
        console.log('🚀 ~ parseWebsiteContent ~ textContent:', textContent)
        if (textContent.length > 200) {
          // Only use if substantial content
          articleContent = element.innerHTML || ''
          wordCount = textContent
            .split(/\s+/)
            .filter((word: string) => word.length > 0).length
          readingTime = Math.max(1, Math.ceil(wordCount / 200))
          break
        }
      }
    }

    // Smart fallback: find the largest content block
    if (!articleContent) {
      console.log('SMART FALLBACK - finding largest content blocks')

      // Get all divs and find the ones with the most text content
      const allDivs = Array.from(document.querySelectorAll('div'))
      const candidates = allDivs
        .map((div) => ({
          element: div,
          textLength: (div as any).textContent?.trim().length || 0,
          text: (div as any).textContent?.trim() || '',
        }))
        .filter(
          (candidate) =>
            candidate.textLength > 500 && // Must have substantial content
            candidate.textLength < 50000 && // Not too large (probably full page)
            !(candidate.element as any).querySelector('nav, header, footer') // Avoid navigation areas
        )
        .sort((a, b) => b.textLength - a.textLength) // Sort by text length

      console.log('Content candidates found:', candidates.length)

      if (candidates.length > 0) {
        const best = candidates[0]
        console.log(
          'Using largest content block with',
          best.textLength,
          'characters'
        )
        articleContent = (best.element as any).innerHTML || ''
        wordCount = best.text
          .split(/\s+/)
          .filter((word: string) => word.length > 0).length
        readingTime = Math.max(1, Math.ceil(wordCount / 200))
      }

      // Final fallback: use body content but clean it up
      if (!articleContent) {
        console.log('FINAL FALLBACK - using cleaned body')
        const body = document.querySelector('body')
        if (body) {
          // Remove unwanted elements
          const elementsToRemove = body.querySelectorAll(
            'script, style, nav, header, footer, aside, .advertisement, .ads, [class*="nav"], [class*="menu"]'
          )
          elementsToRemove.forEach((el: any) => el.remove())

          const textContent = body.textContent?.trim() || ''
          console.log('Body text length:', textContent.length)
          if (textContent.length > 100) {
            articleContent = body.innerHTML || ''
            wordCount = textContent
              .split(/\s+/)
              .filter((word: string) => word.length > 0).length
            readingTime = Math.max(1, Math.ceil(wordCount / 200))
          }
        }
      }
    }
  } catch (error) {
    console.warn('Failed to extract article content:', error)
  }

  // Final fallback: estimate from title and description
  if (!wordCount) {
    const fallbackText = `${title} ${description}`
    wordCount = fallbackText
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    readingTime = Math.max(1, Math.ceil(wordCount / 200))
  }

  // Construct absolute URLs for images
  let absoluteImage = ''
  if (image) {
    try {
      absoluteImage = new URL(image, validUrl).toString()
    } catch {
      absoluteImage = image // Use as-is if URL construction fails
    }
  }

  return {
    url: validUrl.toString(),
    title: title.trim(),
    description: description.trim(),
    image: absoluteImage,
    domain,
    siteName: siteName.trim(),
    author: author.trim(),
    wordCount,
    readingTime,
    content: articleContent,
    extractedAt: new Date().toISOString(),
  }
}
