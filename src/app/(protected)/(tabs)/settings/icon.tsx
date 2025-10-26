import { getAppIcon, setAppIcon } from 'expo-dynamic-app-icon'
import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text } from 'react-native'

interface IconOptions {
  id: string
  name: string
  image: any
  description?: string
}

const ICON_OPTIONS: IconOptions[] = [
  {
    id: 'mono',
    name: 'Monochrome',
    image: require('@img/icon-mono.png'),
  },
  {
    id: 'default',
    name: 'Classic',
    image: require('@img/icon.png'),
  },
  {
    id: 'dark',
    name: 'Dark',
    image: require('@img/icon-dark.png'),
  },
]

export default function Icon() {
  const [currentIcon, setCurrentIcon] = useState<string | null>(null)

  useEffect(() => {
    const currentIcon = getAppIcon()
    setCurrentIcon(currentIcon)
  }, [])

  const handleIconChange = async (iconId: string) => {
    await setAppIcon(iconId)
    setCurrentIcon(iconId)
  }

  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior='automatic'
      showsVerticalScrollIndicator={false}
    >
      <Text>Icon</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
})
