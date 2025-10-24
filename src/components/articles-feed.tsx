import { COLORS } from '@/constants/Colors'
import { RssArticle, rssArticles, savedItems } from '@/db/schema'
import { useUser } from '@clerk/clerk-expo'
import { desc, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import * as Crypto from 'expo-crypto'
import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

type FeedSource = 'expo' | 'react-native'

interface ArticlesFeedProps {
  maxItems?: number
  feedSource?: FeedSource
  title?: string
}

// interface RssArticle {
//   id: string
//   title: string
//   url: string
//   description: string
//   publishedDate: string
//   category: string
//   image: string
//   source: string
//   estimatedReadTime: number
// }

interface ArticlesCardProps {
  article: RssArticle
  onSave: (article: RssArticle) => void
  variant?: 'featured' | 'compact'
}

const ArticleCard = ({
  article,
  onSave,
  variant = 'compact',
}: ArticlesCardProps) => {
  const hasImage = article.image_url && article.image_url.length > 0

  const handlePress = () => {
    if (article.url) {
      Linking.openURL(article.url)
    }
  }

  if (variant === 'featured') {
    return (
      <TouchableOpacity onPress={handlePress} style={styles.featuredCard}>
        {hasImage && (
          <Image
            source={{ uri: article.image_url || '' }}
            style={styles.featuredImage}
          />
        )}
        <View style={styles.featuredContent}>
          <Text numberOfLines={2} style={styles.featuredTitle}>
            {article.title}
          </Text>
          <View style={styles.cardActions}>
            <View style={styles.featuredMeta}>
              <Text style={styles.featuredMetaText}>{article.source}</Text>
              <Text style={styles.featuredMetaText}>
                - {article.estimated_read_time}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={(e) => {
                e.stopPropagation()
                onSave(article)
              }}
            >
              <Image
                source={require('@img/icon.png')}
                style={styles.saveButtonImage}
              />
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity onPress={handlePress} style={styles.compactCard}>
      <View style={styles.compactCardContent}>
        <View style={styles.compactTopRow}>
          <View style={styles.compactTitleContainer}>
            <Text numberOfLines={2} style={styles.compactTitle}>
              {article.title}
            </Text>
          </View>
          {hasImage && (
            <Image
              source={{ uri: article.image_url || '' }}
              style={styles.compactImage}
            />
          )}
        </View>
        <View style={styles.cardActions}>
          <View style={styles.featuredMeta}>
            <Text style={styles.featuredMetaText}>{article.source}</Text>
            <Text style={styles.featuredMetaText}>
              - {article.estimated_read_time}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={(e) => {
              e.stopPropagation()
              onSave(article)
            }}
          >
            <Image
              source={require('@img/icon.png')}
              style={{ width: 20, height: 20 }}
            />
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default function ArticlesFeed({
  maxItems = 10,
  feedSource = 'react-native',
  title = 'React Native Articles',
}: ArticlesFeedProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [articles, setArticles] = useState<RssArticle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const db = useSQLiteContext()
  const drizzleDb = drizzle(db)
  const { user } = useUser()
  const router = useRouter()

  const loadArticles = async () => {
    try {
      const cachedArticles = await drizzleDb
        .select()
        .from(rssArticles)
        .orderBy(desc(rssArticles.published_date))
        .limit(maxItems)

      console.log('Cached articles:', cachedArticles)

      if (cachedArticles.length > 0) {
        setArticles(cachedArticles)
        setIsLoading(false)
      } else {
        // Fetch fresh articles if no cached articles
        try {
          setIsLoading(true)
          const response = await fetch(`/api/rss-feed?url=${feedSource}`)
          const result = (await response.json()) as {
            success: boolean
            data: { items: RssArticle[] }
          }
          if (result.success) {
            await drizzleDb.delete(rssArticles)

            const articlesToInsert = result.data.items.map((item: any) => ({
              id: Crypto.randomUUID(),
              title: item.title,
              url: item.url,
              description: item.description,
              published_date: item.publishedDate,
              author: item.author,
              category: item.category,
              image_url: item.image,
              source: item.source,
              estimated_read_time: item.estimatedReadTime,
              feed_url: feedSource,
            }))

            await drizzleDb.insert(rssArticles).values(articlesToInsert as any)

            // Reload articles after inserting
            const newCachedArticles = await drizzleDb
              .select()
              .from(rssArticles)
              .orderBy(desc(rssArticles.published_date))
              .limit(maxItems)
            setArticles(newCachedArticles)
          }
        } catch (error) {
          console.error('Error fetching fresh articles:', error)
        } finally {
          setIsLoading(false)
        }
      }
    } catch (error) {
      console.error('Error loading articles:', error)
    }
  }

  const fetchFreshArticles = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/rss-feed?url=${feedSource}`)
      const result = (await response.json()) as {
        success: boolean
        data: { items: RssArticle[] }
      }
      if (result.success) {
        await drizzleDb.delete(rssArticles)

        const articlesToInsert = result.data.items.map((item: any) => ({
          id: Crypto.randomUUID(),
          title: item.title,
          url: item.url,
          description: item.description,
          published_date: item.publishedDate,
          author: item.author,
          category: item.category,
          image_url: item.image,
          source: item.source,
          estimated_read_time: item.estimatedReadTime,
          feed_url: feedSource,
        }))

        await drizzleDb.insert(rssArticles).values(articlesToInsert as any)

        // Reload articles after inserting
        const newCachedArticles = await drizzleDb
          .select()
          .from(rssArticles)
          .orderBy(desc(rssArticles.published_date))
          .limit(maxItems)
        setArticles(newCachedArticles)
      }
    } catch (error) {
      console.error('Error fetching fresh articles:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadArticles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    fetchFreshArticles()
  }

  const handleSaveArticle = async (article: RssArticle) => {
    // console.log('Saving article:', article)
    try {
      const existing = await drizzleDb
        .select()
        .from(savedItems)
        .where(eq(savedItems.url, article.url))
      console.log('Existing article:', existing)

      if (existing.length > 0) {
        console.log('Article already saved')
        return
      }

      const response = await fetch('/api/parse-url', {
        method: 'POST',
        body: JSON.stringify({ url: article.url }),
      })
      const result = (await response.json()) as { data: { content: string } }
      console.log('Result:', result)

      await drizzleDb.insert(savedItems).values({
        id: Crypto.randomUUID(),
        url: article.url,
        title: article.title,
        excerpt: article.description,
        image_url: article.image_url,
        domain: new URL(article.url).hostname,
        reading_time: article.estimated_read_time,
        user_id: user?.id || '1',
        parsing_status: 'parsed',
        content: result.data.content,
      })

      router.push('/(protected)/(modal)/success' as any)
    } catch (error) {
      console.error('Error saving article:', error)
    }
  }

  if (isLoading || articles.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading articles...</Text>
      </View>
    )
  }

  const renderHeader = () => {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
    )
  }

  const renderItem = ({ item, index }: { item: RssArticle; index: number }) => {
    if (index === 0) {
      return (
        <>
          {renderHeader()}
          <ArticleCard
            article={item}
            onSave={handleSaveArticle}
            variant='featured'
          />
          <View style={styles.separator} />
          {articles.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ paddingHorizontal: 24 }}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {articles.slice(1).map((article, index) => (
                <View key={index} style={styles.compactCardWrapper}>
                  <ArticleCard
                    article={article}
                    onSave={handleSaveArticle}
                    variant='compact'
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </>
      )
    }
    return null
  }

  return (
    <FlatList
      data={articles}
      style={styles.container}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ flex: 1 }}
      contentInsetAdjustmentBehavior='automatic'
      onRefresh={handleRefresh}
      refreshing={isRefreshing}
      showsVerticalScrollIndicator={false}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textGray,
    marginTop: 10,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  separator: {
    height: 16,
  },
  compactCardWrapper: {
    width: 280,
    marginRight: 16,
    marginVertical: 4,
  },
  featuredCard: {
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
    elevation: 4,
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
    lineHeight: 26,
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 14,
    color: COLORS.textGray,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredMetaText: {
    fontSize: 12,
    color: COLORS.textGray,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  saveButtonImage: {
    width: 24,
    height: 24,
  },
  saveText: {
    fontSize: 12,
    color: COLORS.textGray,
    marginLeft: 4,
    fontWeight: '500',
  },
  compactCard: {
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
    elevation: 4,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  compactCardContent: {
    padding: 12,
  },
  compactTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 12,
  },
  compactTitleContainer: {
    flex: 1,
  },
  compactImage: {
    width: 60,
    height: 40,
    borderRadius: 8,
  },
  compactTitle: {
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 20,
    fontWeight: '600',
  },
})
