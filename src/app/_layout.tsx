import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { Stack } from 'expo-router'
import { KeyboardProvider } from 'react-native-keyboard-controller'

const InitialLayout = () => {
  const { isSignedIn } = useAuth()

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name='index' />
      </Stack.Protected>
      <Stack.Screen name='(protected)' />
    </Stack>
  )
}

const RootLayout = () => {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <KeyboardProvider>
        <InitialLayout />
      </KeyboardProvider>
    </ClerkProvider>
  )
}

export default RootLayout
