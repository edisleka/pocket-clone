import { COLORS } from '@/constants/Colors'
import { ClerkProvider, useAuth } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import migrations from '@drizzle/migrations'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import { Stack } from 'expo-router'
import { openDatabaseSync, SQLiteProvider } from 'expo-sqlite'
import { Suspense } from 'react'
import { ActivityIndicator } from 'react-native'
import { KeyboardProvider } from 'react-native-keyboard-controller'

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

  console.log(success, error)

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

export default RootLayout
