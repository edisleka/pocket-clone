import { ScrollView, Text } from 'react-native'

export default function HomeScreen() {
  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      contentInsetAdjustmentBehavior='automatic'
    >
      <Text>Home Screen</Text>
    </ScrollView>
  )
}
