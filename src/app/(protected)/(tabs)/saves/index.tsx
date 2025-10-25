import SavedItemCard from '@/components/SavedItemCard'
import { COLORS } from '@/constants/Colors'
import { useUser } from '@clerk/clerk-expo'
import { SavedItem, savedItems } from '@db/schema'
import Ionicons from '@expo/vector-icons/build/Ionicons'
import { and, desc, eq, or } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import { Stack, useFocusEffect } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native'

export default function SavesScreen() {
  const [items, setItems] = useState<SavedItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useUser()

  const db = useSQLiteContext()
  const drizzleDb = drizzle(db)

  const loadSavedItems = async () => {
    try {
      const result = await drizzleDb
        .select()
        .from(savedItems)
        .where(
          and(
            eq(savedItems.is_deleted, false),
            or(
              eq(savedItems.user_id, user?.id || ''),
              eq(savedItems.user_id, '1')
            )
          )
        )
        .orderBy(desc(savedItems.created_at))

      setItems(result)
      console.log('result is: ', result)
    } catch (error) {
      console.log('error is: ', error)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadSavedItems()
    }, [])
  )

  const handleToggleFavorite = async (item: SavedItem) => {
    try {
      await drizzleDb
        .update(savedItems)
        .set({
          is_favorite: !item.is_favorite,
        })
        .where(eq(savedItems.id, item.id))

      setItems((prevItems) =>
        prevItems.map((i) =>
          i.id === item.id ? { ...i, is_favorite: !i.is_favorite } : i
        )
      )
    } catch (error) {
      console.error(error)
    }
  }

  const handleShare = async (item: SavedItem) => {
    try {
      await Share.share({
        message: `${item.title || 'Check out this article'}\n${item.url}`,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleMore = async (item: SavedItem) => {}

  return (
    <>
      <Stack.Screen
        options={{
          headerSearchBarOptions: { placeholder: 'Search' },
        }}
      />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <SavedItemCard
            item={item}
            onToggleFavorite={() => handleToggleFavorite(item)}
            onShare={() => handleShare(item)}
            onMore={() => handleMore(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentInsetAdjustmentBehavior='automatic'
        ListHeaderComponent={() => (
          <>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color={COLORS.primary} />
              </View>
            ) : items.length === 0 ? (
              <View style={styles.loadingContainer}>
                <Ionicons name='heart' size={48} color={COLORS.textLight} />
                <Text style={styles.emptyText}>No items found</Text>
                <Text style={styles.emptySubtext}>
                  Add items to your saves to get started.
                </Text>
              </View>
            ) : null}
          </>
        )}
      />
    </>
  )
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginStart: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 10,
  },
})
