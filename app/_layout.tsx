import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { createContext, useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
export const AuthProvider = createContext(null)

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [userData, setuserData] = useState<any>();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  

  const logoutFun = ()=>{
    setuserData(null)
  }
  const loginFun = (data:any)=>{
      setuserData(data)
  }

  return (
    <AuthProvider.Provider value={{data:userData,logoutFun,loginFun}}>
    <ThemeProvider value={colorScheme === 'dark' ? DefaultTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen  name="(tabs)" options={{ headerShown: false, statusBarHidden:false, statusBarColor:'gray'  }} />
        <Stack.Screen name="productDetails"  options={{ headerShown: false, statusBarHidden:false, statusBarColor:'gray' }} />
        <Stack.Screen name="cartScreen" options={{ headerShown: false, statusBarHidden:false, statusBarColor:'gray' }}/>
        <Stack.Screen name="searchResults" options={{ headerShown: false, statusBarHidden:false, statusBarColor:'gray' }}/>
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
    </AuthProvider.Provider>
  );
}
