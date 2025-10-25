import { type SavedItem } from '@/db/schema'
import { COLORS } from '@constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

// interface SavedItemWithActions extends SavedItem {
//   onToggleFavorite: () => void;
//   onShare: () => void;
//   onMore: () => void;
// }

interface SavedItemCardProps {
  item: SavedItem
  onToggleFavorite: () => void
  onShare: () => void
  onMore: () => void
}

export default function SavedItemCard({
  item,
  onToggleFavorite,
  onShare,
  onMore,
}: SavedItemCardProps) {
  const hasImage = item.image_url && item.image_url.length > 0

  return (
    <View style={styles.itemContainer}>
      {/* <Link href={`/(protected)/(tabs)/saves`} asChild> */}
      <TouchableOpacity style={styles.itemContent}>
        <View style={styles.itemText}>
          <Text style={styles.itemTitle} numberOfLines={3}>
            {item.title || item.url}
          </Text>
          <Text style={styles.itemSubtitle}>
            {item.domain} {item.reading_time && `• ${item.reading_time} min`}
          </Text>
        </View>

        {hasImage && (
          <Image
            source={{ uri: item.image_url || '' }}
            style={styles.itemImage}
          />
        )}
      </TouchableOpacity>
      {/* </Link> */}

      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onToggleFavorite}
        >
          <Ionicons
            name={item.is_favorite ? 'star' : 'star-outline'}
            size={20}
            color={item.is_favorite ? '#FFD700' : COLORS.textLight}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <Ionicons name='share-outline' size={20} color={COLORS.textLight} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onMore}>
          <Ionicons
            name='ellipsis-horizontal'
            size={20}
            color={COLORS.textLight}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemText: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
    lineHeight: 24,
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: COLORS.textGray,
    lineHeight: 18,
  },
  itemImage: {
    width: 100,
    height: 60,
    borderRadius: 4,
    backgroundColor: '#f5f5f5',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
