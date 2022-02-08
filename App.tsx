import React from 'react';
import { LogBox } from 'react-native';
import { StatusBar } from 'react-native';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components'

import 'intl'
import 'intl/locale-data/jsonp/pt-BR'

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'

import theme from './src/global/styles/theme';

import { AuthProvider, useAuth } from './src/hooks/auth';
import { Routes } from './src/routes';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  })

  const { userStorageLoading } = useAuth()

  LogBox.ignoreLogs([
    "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
  ]);

  if (!fontsLoaded || userStorageLoading) return <AppLoading />

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle='light-content' />

      <AuthProvider>
        <Routes />
      </AuthProvider>

    </ThemeProvider>
  )
}

