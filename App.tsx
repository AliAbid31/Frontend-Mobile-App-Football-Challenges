import React from 'react';
import { View, Text } from 'react-native';
import { useFonts, VT323_400Regular } from '@expo-google-fonts/vt323';

// On importe votre nouveau fichier Home
import Home from './src/pages/Home'; 

export default function App() {
  // Cette ligne charge la police !
  let [fontsLoaded] = useFonts({
    VT323_400Regular,
  });

  // Si la police charge encore, on affiche un écran noir
  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: 'black' }} />;
  }

  // Une fois chargée, on affiche votre page Home
  return <Home />;
}