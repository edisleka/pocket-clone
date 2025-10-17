import { COLORS } from '@constants/Colors'
import { Stack } from 'expo-router'

export default function SavesLayout() {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: COLORS.white } }}>
      <Stack.Screen
        name='index'
        options={{
          title: 'Saves',
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
        }}
      />
    </Stack>
  )
}
