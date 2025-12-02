import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from 'react';
import './globals.css';

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require('../assets/assets/fonts/Quicksand-Bold.ttf'),
    "QuickSand-Medium": require('../assets/assets/fonts/Quicksand-Medium.ttf'),
    "QuickSand-Regular": require('../assets/assets/fonts/Quicksand-Regular.ttf'),
    "QuickSand-SemiBold": require('../assets/assets/fonts/Quicksand-SemiBold.ttf'),
    "QuickSand-Light": require('../assets/assets/fonts/Quicksand-Light.ttf'),
  })

  useEffect(() => {
    if (error) throw error
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded, error])

  return <Stack screenOptions={{ headerShown: false }} />;
}
