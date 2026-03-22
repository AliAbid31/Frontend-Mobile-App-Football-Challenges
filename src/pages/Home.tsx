import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator
} from 'react-native';
import * as Linking from 'expo-linking';

import Login from './Login';
import Register from './Register';
import GoalsChallenge from './Goals';
import AssistsChallenge from './Assists';
import TrophiesChallenge from './Trophies';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

import { useFonts, Jaro_400Regular } from '@expo-google-fonts/jaro';
import { VT323_400Regular } from '@expo-google-fonts/vt323';

type AuthMode = 'welcome' | 'login' | 'register' | 'forgot' | 'reset' | 'goals' | 'assists' | 'trophies';

export default function Home() {
  const { width: vw, height: vh } = useWindowDimensions();
  const isLandscape = vw > vh;

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<AuthMode>('welcome');
  const [resetToken, setResetToken] = useState<string>(''); 

  let [fontsLoaded] = useFonts({ Jaro_400Regular, VT323_400Regular });

  const lineAnim = useRef(new Animated.Value(0)).current;
  const cursorAnim = useRef(new Animated.Value(1)).current;
  const loggedInLineAnim = useRef(new Animated.Value(0)).current;
  const colorCycleAnim = useRef(new Animated.Value(0)).current;

  const fullText = "Welcome To My Football Challenges";
  const [displayedText, setDisplayedText] = useState<string>("");
  const [loggedInDisplayedText, setLoggedInDisplayedText] = useState<string>("");

  const handleDeepLink = (event: { url: string }) => {
      if (event.url.includes('reset-password/')) {
          const parts = event.url.split('reset-password/');
          const token = parts[1]?.split('?')[0];
          if (token) { setResetToken(token); setAuthMode('reset'); }
      }
  };

  useEffect(() => {
      Linking.getInitialURL().then((url) => { if (url) handleDeepLink({ url }); });
      const subscription = Linking.addEventListener('url', handleDeepLink);
      return () => subscription.remove();
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) setIsLoggedIn(true);
    }
    checkToken();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(cursorAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])
    ).start();

    if (authMode === 'welcome' && !isLoggedIn) {
      setDisplayedText(""); lineAnim.setValue(0);
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(fullText.substring(0, i + 1)); i++;
        if (i >= fullText.length) {
          clearInterval(interval);
          Animated.timing(lineAnim, { toValue: vw * 0.4, duration: 800, useNativeDriver: false }).start();
        }
      }, 80);
      return () => clearInterval(interval);
    }
  }, [authMode, isLoggedIn, vw]);

  useEffect(() => {
    if (isLoggedIn) {
      loggedInLineAnim.setValue(0);
      Animated.timing(loggedInLineAnim, { toValue: vw, duration: 3000, useNativeDriver: false }).start();
      setLoggedInDisplayedText("");
      let i = 0;
      const interval = setInterval(() => {
        setLoggedInDisplayedText(fullText.substring(0, i + 1)); i++;
        if (i >= fullText.length) clearInterval(interval);
      }, 80);
      Animated.loop(
        Animated.sequence([
          Animated.timing(colorCycleAnim, { toValue: 1, duration: 2000, useNativeDriver: false }),
          Animated.timing(colorCycleAnim, { toValue: 2, duration: 2000, useNativeDriver: false }),
          Animated.timing(colorCycleAnim, { toValue: 0, duration: 2000, useNativeDriver: false }),
        ])
      ).start();
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, vw]);

  if (!fontsLoaded) return <View style={{flex:1, backgroundColor:'black'}}><ActivityIndicator size="large" color="red" /></View>;

  if (authMode === 'reset') return <ResetPassword token={resetToken} onBack={() => setAuthMode('welcome')} onSuccess={() => setAuthMode('login')} />;
  if (authMode === 'goals') return <GoalsChallenge onBack={() => setAuthMode('welcome')} />;
  if (authMode === 'assists') return <AssistsChallenge onBack={() => setAuthMode('welcome')} />;
  if (authMode === 'trophies') return <TrophiesChallenge onBack={() => setAuthMode('welcome')} />;

  if (isLoggedIn) {
    const bgColor = colorCycleAnim.interpolate({ inputRange: [0, 1, 2], outputRange: ['#271258', '#133687', '#271248'] });
    const goalsColor = colorCycleAnim.interpolate({ inputRange: [0, 1, 2], outputRange: ['rgb(93, 169, 236)', '#159a67', 'rgb(51, 130, 199)'] });
    const assistsColor = colorCycleAnim.interpolate({ inputRange: [0, 1, 2], outputRange: ['rgb(185, 233, 123)', 'rgb(224, 125, 26)', '#a3dd1a'] });
    const trophiesColor = colorCycleAnim.interpolate({ inputRange: [0, 1, 2], outputRange: ['rgb(236, 93, 155)', '#9a8415', 'rgb(236, 95, 165)'] });

    return (
      <Animated.View style={[styles.loggedInContainer, { backgroundColor: bgColor }]}>
        <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 30 }}>
          <View style={{ flexDirection: 'row', marginTop: '2%' }}>
            <Text style={styles.loggedInTitle}>{loggedInDisplayedText}</Text>
            <Animated.Text style={[styles.loggedInTitle, { color: 'red', opacity: cursorAnim }]}>|</Animated.Text>
          </View>
          <Animated.View style={[styles.loggedInRedLine, { width: loggedInLineAnim }]} />

          <View style={[styles.blackCardsContainer, { 
              flexDirection: isLandscape ? 'row' : 'column', 
              height: isLandscape ? vh * 0.65 : 'auto',
              gap: 20 // Les espaces entre les images demandés
          }]}>
            <Pressable style={[styles.cardWrapper, { width: isLandscape ? vw * 0.26 : '90%' }]} onPress={() => setAuthMode('goals')}>
              {({ pressed, hovered }: any) => (
                <>
                  <Image source={require('../../assets/objects/goals.jpg')} style={[styles.cardImage, (pressed || hovered) && { transform: [{ scale: 1.1 }] }, { height: isLandscape ? vh * 0.4 : 220 }]} resizeMode='cover' />
                  <Animated.Text style={[styles.cardText, { color: goalsColor }]}>100 000 GOALS{"\n"}CHALLENGE</Animated.Text>
                </>
              )}
            </Pressable>

            <Pressable style={[styles.cardWrapper, { width: isLandscape ? vw * 0.26 : '90%' }]} onPress={() => setAuthMode("assists")}>
              {({ pressed, hovered }: any) => (
                <>
                  <Image source={require('../../assets/objects/assists.png')} style={[styles.cardImage, (pressed || hovered) && { transform: [{ scale: 1.1 }] }, { height: isLandscape ? vh * 0.4 : 220 }]} resizeMode='cover' />
                  <Animated.Text style={[styles.cardText, { color: assistsColor }]}>10 000 ASSISTS{"\n"}CHALLENGE</Animated.Text>
                </>
              )}
            </Pressable>

            <Pressable style={[styles.cardWrapper, { width: isLandscape ? vw * 0.26 : '90%' }]} onPress={() => setAuthMode('trophies')}>
              {({ pressed, hovered }: any) => (
                <>
                  <Image source={require('../../assets/objects/trophies.png')} style={[styles.cardImage, (pressed || hovered) && { transform: [{ scale: 1.1 }] }, { height: isLandscape ? vh * 0.4 : 220 }]} resizeMode='cover' />
                  <Animated.Text style={[styles.cardText, { color: trophiesColor }]}>1 000 TROPHIES{"\n"}CHALLENGE</Animated.Text>
                </>
              )}
            </Pressable>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={async () => { await AsyncStorage.removeItem('userToken'); setIsLoggedIn(false); setAuthMode('welcome'); }}>
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
          <View style={{ height: vh * 0.1, backgroundColor: 'black', width: '100%', marginTop: 20 }} />
        </ScrollView>
      </Animated.View>
    );
  }

  return (
    <View style={styles.blackBackground}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.centerContainer}>
        {authMode === 'welcome' && (
          <View style={styles.authWelcome}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.titleText}>{displayedText}</Text>
              <Animated.Text style={[styles.titleText, { color: 'red', opacity: cursorAnim }]}>|</Animated.Text>
            </View>
            <Animated.View style={[styles.redLine, { width: lineAnim }]} />
            <View style={[styles.buttonGroup, !isLandscape && {flexDirection: 'column'}]}>
              <Pressable style={({ pressed, hovered }: any) => [styles.pillBtn, (pressed || hovered) && styles.pillBtnActive]} onPress={() => setAuthMode('login')}>
                {({ pressed, hovered }: any) => <Text style={[styles.pillBtnText, (pressed || hovered) && styles.pillBtnTextActive]}>LOGIN</Text>}
              </Pressable>
              <Pressable style={({ pressed, hovered }: any) => [styles.pillBtn, (pressed || hovered) && styles.pillBtnActive]} onPress={() => setAuthMode('register')}>
                {({ pressed, hovered }: any) => <Text style={[styles.pillBtnText, (pressed || hovered) && styles.pillBtnTextActive]}>REGISTER</Text>}
              </Pressable>
            </View>
          </View>
        )}
        {authMode === 'login' && <Login onBack={() => setAuthMode('welcome')} onLoginSuccess={() => setIsLoggedIn(true)} />}
        {authMode === 'register' && <Register onBack={() => setAuthMode('welcome')} onRegisterSuccess={() => setAuthMode('login')} />}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  blackBackground: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  centerContainer: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  authWelcome: { alignItems: 'center' },
  titleText: { fontSize: 32, color: '#fff', fontFamily: 'VT323_400Regular' },
  redLine: { height: 3, backgroundColor: '#f00', marginTop: 8 },
  buttonGroup: { flexDirection: 'row', marginTop: 40, gap: 15 },
  pillBtn: { borderWidth: 3, borderColor: '#fff', paddingVertical: 10, paddingHorizontal: 35, borderRadius: 15, height: 50, justifyContent: 'center', alignItems: 'center' },
  pillBtnActive: { backgroundColor: '#fff' },
  pillBtnText: { color: '#fff', fontFamily: 'VT323_400Regular', fontSize: 25 },
  pillBtnTextActive: { color: '#000' },
  loggedInContainer: { flex: 1, width: '100%' },
  loggedInTitle: { fontSize: 24, color: '#fff', fontFamily: 'VT323_400Regular', textAlign: 'center' },
  loggedInRedLine: { height: 4, backgroundColor: '#f00', marginVertical: 15 },
  blackCardsContainer: { width: '95%', backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20, borderRadius: 15 },
  cardWrapper: { alignItems: 'center' },
  cardImage: { width: '100%', borderRadius: 10, marginBottom: 10 },
  cardText: { fontFamily: 'VT323_400Regular', fontSize: 20, textAlign: 'center' },
  logoutBtn: { marginTop: 30, paddingVertical: 12, paddingHorizontal: 30, minWidth: 150, alignItems: 'center', backgroundColor: '#dc3545', borderRadius: 6 },
  logoutBtnText: { color: '#fff', fontFamily: 'VT323_400Regular', fontSize: 20 }
});