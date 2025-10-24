import { COLORS } from '@constants/Colors'
import AntDesign from '@expo/vector-icons/AntDesign'
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

interface SavedConfirmationProps {
  onAddTags?: () => void
  onDismiss?: () => void
}

export default function SavedConfirmation({
  onAddTags,
  onDismiss,
}: SavedConfirmationProps) {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('@img/icon.png')}
        style={styles.pocketIcon}
        resizeMode='contain'
      />

      <Animated.View style={styles.savedBadge} entering={FadeIn.duration(300)}>
        <Animated.View style={styles.checkIcon} entering={FadeIn.duration(300)}>
          <AntDesign name='check' size={20} color='white' />
        </Animated.View>
        <Text style={styles.savedText}>Saved to Pocket</Text>
      </Animated.View>

      <Animated.View
        style={styles.buttonContainer}
        entering={FadeIn.delay(300).duration(500)}
      >
        <TouchableOpacity style={styles.addTagsButton} onPress={onAddTags}>
          <Text style={styles.addTagsButtonText}>Add tags</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDismiss}>
          <Text style={styles.dismissText}>Tap to dismiss</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    height: '100%',
  },
  pocketIcon: {
    width: 80,
    height: 80,
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 12,
  },
  checkIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2A9D8F',
  },
  buttonContainer: {
    width: '100%',
    gap: 24,
  },
  addTagsButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    width: '100%',
  },
  addTagsButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  dismissText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
})
