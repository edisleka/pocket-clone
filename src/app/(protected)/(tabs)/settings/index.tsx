import { COLORS } from '@/constants/Colors'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { ReactNativeLegal } from 'react-native-legal'

export default function SettingsScreen() {
  const { signOut, isSignedIn } = useAuth()
  const { user } = useUser()
  const [isPro, setIsPro] = useState(false)
  const [alwaysOpenOriginalView, setAlwaysOpenOriginalView] = useState(false)

  const openLink = () => {
    WebBrowser.openBrowserAsync('https://www.google.com')
  }

  const launchNotice = () => {
    ReactNativeLegal.launchLicenseListScreen('OSS Notice')
  }

  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior='automatic'
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your account:</Text>
        {user && (
          <Text style={styles.subTitle}>
            {user?.emailAddresses[0].emailAddress}
          </Text>
        )}

        <View style={styles.listContainer}>
          {!isSignedIn && (
            <Link href='/' replace asChild>
              <TouchableOpacity style={styles.listItem}>
                <Text style={[styles.itemText, { fontWeight: '600' }]}>
                  Sign Up or sign in
                </Text>
                <Ionicons
                  name='person-outline'
                  size={22}
                  color={COLORS.textDark}
                />
              </TouchableOpacity>
            </Link>
          )}

          {isSignedIn && (
            <>
              {!isPro && (
                <>
                  <TouchableOpacity style={styles.listItem}>
                    <Ionicons
                      name='diamond-outline'
                      size={22}
                      color={COLORS.textDark}
                    />
                    <Text
                      style={[styles.itemText, { flex: 1, marginLeft: 16 }]}
                    >
                      Go premium
                    </Text>
                    <Ionicons
                      name='chevron-forward'
                      size={22}
                      color={COLORS.textDark}
                    />
                  </TouchableOpacity>
                  <View style={styles.divider} />
                </>
              )}
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => signOut()}
              >
                <Text
                  style={[
                    styles.itemText,
                    { fontWeight: '600', color: COLORS.red },
                  ]}
                >
                  Log out
                </Text>
                <Ionicons name='log-out-outline' size={22} color={COLORS.red} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App customization</Text>
        <View style={styles.listContainer}>
          <View style={styles.listItem}>
            <Text style={styles.itemText}>Always open original view</Text>
            <Switch
              value={alwaysOpenOriginalView}
              onValueChange={setAlwaysOpenOriginalView}
            />
          </View>
          <View style={styles.divider} />
          <Link href='/settings/icon' asChild>
            <TouchableOpacity style={styles.listItem}>
              <Text style={[styles.itemText]}>App Icon</Text>
              <Ionicons
                name='chevron-forward'
                size={22}
                color={COLORS.textDark}
              />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About & support</Text>
        <View style={styles.listContainer}>
          <TouchableOpacity style={styles.listItem} onPress={openLink}>
            <Text style={styles.itemText}>Get help and support</Text>
            <Ionicons
              name='help-circle-outline'
              size={22}
              color={COLORS.textDark}
            />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.listItem} onPress={openLink}>
            <Text style={styles.itemText}>Terms of service</Text>
            <Ionicons
              name='document-text-outline'
              size={22}
              color={COLORS.textDark}
            />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.listItem} onPress={openLink}>
            <Text style={styles.itemText}>Privacy policy</Text>
            <Ionicons
              name='document-text-outline'
              size={22}
              color={COLORS.textDark}
            />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.listItem} onPress={launchNotice}>
            <Text style={styles.itemText}>Open source licenses</Text>
            <Ionicons
              name='document-text-outline'
              size={22}
              color={COLORS.textDark}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 16,
    color: COLORS.textDark,
  },
  subTitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 8,
    marginLeft: 16,
  },
  listContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  listItem: {
    backgroundColor: COLORS.itemBackground,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C6C6C8',
    marginLeft: 16,
  },
})
