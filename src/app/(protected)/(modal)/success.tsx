import { COLORS } from '@/constants/Colors'
import SavedConfirmation from '@components/saved-confirmation'
import { useRouter } from 'expo-router'
import { View } from 'react-native'

export default function SuccessModal() {
  const router = useRouter()

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white, height: '100%' }}>
      <SavedConfirmation onDismiss={() => router.dismiss()} />
    </View>
  )
}
