import { Stack } from 'expo-router'

export default function ModalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='success'
        options={{
          presentation: 'formSheet',
          headerShown: false,
          sheetAllowedDetents: [0.5, 1],
          sheetGrabberVisible: false,
          headerShadowVisible: false,
          title: '',
          contentStyle: {
            height: '100%',
          },
        }}
      />
    </Stack>
  )
}
