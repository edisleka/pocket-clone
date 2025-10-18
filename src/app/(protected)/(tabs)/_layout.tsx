import { COLORS } from '@constants/Colors'
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs'

export default function TabsLayout() {
  return (
    <NativeTabs blurEffect='systemChromeMaterial' tintColor={COLORS.textDark}>
      <NativeTabs.Trigger name='home'>
        <Label>Home</Label>
        <Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          drawable='ic_menu_home'
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name='saves'>
        <Label>Saves</Label>
        <Icon
          sf={{ default: 'bookmark', selected: 'bookmark.fill' }}
          drawable='ic_menu_star'
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name='settings'>
        <Label>Settings</Label>
        <Icon
          sf={{ default: 'gearshape', selected: 'gearshape.fill' }}
          drawable='ic_menu_preferences'
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
