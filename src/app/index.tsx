import { COLORS } from '@/constants/Colors'
import { AntDesign } from '@expo/vector-icons'
import { Link } from 'expo-router'
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'

// import { Redirect } from 'expo-router'

export default function Index() {
  // return <Redirect href='/(protected)/(tabs)/home' />

  const handleSocialLogin = (provider: string) => {}

  return (
    <KeyboardAvoidingView behavior='padding' style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Image
            source={require('@img/pocket-logo.png')}
            style={styles.logoIcon}
          />
        </View>
        <Text style={styles.title}>Pocket</Text>
      </View>

      <View style={styles.buttonsSection}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSocialLogin('oauth_apple')}
        >
          <AntDesign name='apple' size={24} color='#000' />
          <Text style={styles.buttonText}>Continue with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSocialLogin('oauth_google')}
        >
          <AntDesign name='google' size={24} color='#000' />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.emailSection}>
        <TextInput
          style={styles.emailInput}
          placeholder='Email'
          placeholderTextColor={'#999'}
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>

        <Link href='/(protected)/(tabs)/home' asChild>
          <TouchableOpacity style={{ marginTop: 16, alignSelf: 'center' }}>
            <Text style={{ color: COLORS.secondary, fontWeight: 'bold' }}>
              Skip for now
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 30,
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 30,
  },
  logoIcon: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  button: {
    borderWidth: 1,
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderColor: COLORS.border,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 100,
    gap: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  buttonText: {
    fontSize: 16,
  },
  buttonsSection: {
    gap: 12,
  },
  emailSection: {
    marginBottom: 30,
  },
  emailInput: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
})
