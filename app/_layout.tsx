import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from 'react';
import './globals.css';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://ca493c99d1f716b9b31aa6025698ae49@o4510476404981760.ingest.de.sentry.io/4510476428116048',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
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
});