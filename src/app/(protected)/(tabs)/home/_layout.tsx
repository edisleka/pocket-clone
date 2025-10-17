import { COLORS } from '@constants/Colors'
import { Stack } from 'expo-router'

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: COLORS.white } }}>
      <Stack.Screen
        name='index'
        options={{
          title: 'Home',
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
        }}
      />
    </Stack>
  )
}
