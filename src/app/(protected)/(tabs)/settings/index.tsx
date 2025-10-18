import { useAuth, useUser } from '@clerk/clerk-expo'
import { Button, ScrollView, Text } from 'react-native'

export default function SettingsScreen() {
  const { signOut } = useAuth()
  const { user } = useUser()

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      contentInsetAdjustmentBehavior='automatic'
    >
      <Text>Your account: {user?.emailAddresses[0].emailAddress}</Text>
      <Button title='Sign Out' onPress={() => signOut()} />
    </ScrollView>
  )
}
