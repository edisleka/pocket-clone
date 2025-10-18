import { COLORS } from '@/constants/Colors'
import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true)

  const translateY1 = useSharedValue(0)
  const translateY2 = useSharedValue(0)
  const translateY3 = useSharedValue(0)

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY1.value }],
  }))
  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY2.value }],
  }))
  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY3.value }],
  }))

  useEffect(() => {
    if (isLoading) {
      const bounceSequence = withSequence(
        withTiming(-35, {
          duration: 350,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(0, { duration: 350, easing: Easing.in(Easing.quad) }),
        withTiming(0, { duration: 800 })
      )
      translateY1.value = withRepeat(bounceSequence, -1, false)
      translateY2.value = withDelay(150, withRepeat(bounceSequence, -1, false))
      translateY3.value = withDelay(300, withRepeat(bounceSequence, -1, false))
    } else {
      translateY1.value = withTiming(0, { duration: 300 })
      translateY2.value = withTiming(0, { duration: 300 })
      translateY3.value = withTiming(0, { duration: 300 })
    }
  }, [isLoading])

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      contentInsetAdjustmentBehavior='automatic'
    >
      <View style={styles.content}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingShapes}>
            <Animated.View
              style={[styles.shape, styles.circle, animatedStyle1]}
            />
            <Animated.View style={[styles.triangle, animatedStyle2]} />
            <Animated.View
              style={[styles.shape, styles.square, animatedStyle3]}
            />
          </View>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
  },
  shape: {
    width: 40,
    height: 40,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingShapes: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textGray,
  },
  circle: {
    backgroundColor: '#E85A4F',
    borderRadius: 20,
  },
  triangle: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#F4A261',
  },
  square: {
    backgroundColor: '#2A9D8F',
  },
})
