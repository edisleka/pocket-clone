import { COLORS } from '@constants/Colors'
import Ionicons from '@expo/vector-icons/build/Ionicons'
import { Link, Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'

export default function SavesLayout() {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: COLORS.white } }}>
      <Stack.Screen
        name='index'
        options={{
          title: 'Saves',
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerRight: () => (
            <Link href='/(protected)/(modal)/add-url' asChild>
              <TouchableOpacity>
                <Ionicons name='add' size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
    </Stack>
  )
}
