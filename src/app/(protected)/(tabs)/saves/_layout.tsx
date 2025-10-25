import { COLORS } from '@constants/Colors'
import Ionicons from '@expo/vector-icons/build/Ionicons'
import { Stack } from 'expo-router'
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
            <TouchableOpacity>
              <Ionicons name='add' size={24} color={COLORS.textDark} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  )
}
