import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';


async function changeScreenOrientation(orientation: ScreenOrientation.OrientationLock) {
  await ScreenOrientation.lockAsync(orientation);
}
export default function RootLayout() {
  const colorScheme = useColorScheme();
  changeScreenOrientation(ScreenOrientation.OrientationLock.LANDSCAPE);
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}></Stack>
    </ThemeProvider>
  );
}
