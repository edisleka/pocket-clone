import { useUser } from '@clerk/clerk-expo'
import * as Sentry from '@sentry/react-native'
import { Stack } from 'expo-router'
import { useEffect } from 'react'

export default function ProtectedLayout() {
  const user = useUser()

  useEffect(() => {
    if (user) {
      Sentry.setUser({
        id: user.user?.id,
        email: user.user?.emailAddresses[0].emailAddress,
      })
    } else {
      Sentry.setUser(null)
    }
  }, [])

  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='(modal)' options={{ headerShown: false }} />
    </Stack>
  )
}
