import { Stack } from 'expo-router'
import { KeyboardProvider } from 'react-native-keyboard-controller'

const InitialLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='(protected)' />
    </Stack>
  )
}

const RootLayout = () => {
  return (
    <KeyboardProvider>
      <InitialLayout />
    </KeyboardProvider>
  )
}

export default RootLayout
