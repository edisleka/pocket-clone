import { COLORS } from '@/constants/Colors'
import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import migrations from '@drizzle/migrations'
import * as Sentry from '@sentry/react-native'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { isRunningInExpoGo } from 'expo'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import { Stack, useNavigationContainerRef } from 'expo-router'
import { openDatabaseSync, SQLiteProvider } from 'expo-sqlite'
import { Suspense, useEffect } from 'react'
import { ActivityIndicator } from 'react-native'
import { KeyboardProvider } from 'react-native-keyboard-controller'

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo,
})

Sentry.init({
  dsn: 'https://e24919dcb0b5cf41003278d86ed4ee69@o4509888191594496.ingest.de.sentry.io/4510250879811664',

  sendDefaultPii: true,

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.mobileReplayIntegration()],

  // spotlight: __DEV__,
})

const DATABASE_NAME = 'pocket'

const InitialLayout = () => {
  const { isSignedIn } = useAuth()
  const db = openDatabaseSync(DATABASE_NAME)
  useDrizzleStudio(db)

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
  const expoDb = openDatabaseSync(DATABASE_NAME)
  const db = drizzle(expoDb)
  const { success, error } = useMigrations(db, migrations)

  // Log migration status but don't crash the app
  // if (error) {
  //   console.warn('Migration warning (tables may already exist):', error.message)
  // } else if (success) {
  //   console.log('Migrations completed successfully')
  // }

  const ref = useNavigationContainerRef()

  useEffect(() => {
    navigationIntegration.registerNavigationContainer(ref)
  }, [])

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <KeyboardProvider>
        <Suspense
          fallback={<ActivityIndicator size='large' color={COLORS.primary} />}
        >
          <SQLiteProvider
            useSuspense
            databaseName={DATABASE_NAME}
            options={{ enableChangeListener: true }}
          >
            <InitialLayout />
          </SQLiteProvider>
        </Suspense>
      </KeyboardProvider>
    </ClerkProvider>
  )
}

export default Sentry.wrap(RootLayout)
