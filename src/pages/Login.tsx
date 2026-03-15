import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Pressable, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import ForgotPassword from './ForgotPassword';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResetPassword from './ResetPassword';

const { width: vw } = Dimensions.get('window');
type AuthMode = 'welcome' | 'login' | 'forgot' | 'reset';

import { API_URL } from '../apiConfig';

interface LoginProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

export default function Login({ onBack, onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState<string>(''); 
  const [errMessage, setErrMessage] = useState('');

  const handleLogin = async () => {
    console.log("Bouton cliqué !");
    setErrMessage('');
    if (!username || !password) {
      setErrMessage("Please enter all fields");
      return; 
    }
    setIsLoading(true);
    console.log("Tentative de connexion sur :", `${API_URL}/login`);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log(data);
        await AsyncStorage.setItem('userToken', data.token); 
        onLoginSuccess();
      } else {
        setErrMessage(data.detail || "An error occurred");
      }
    }
      catch (err) {
        console.log(err);
        setErrMessage("Connection error to server");
      }
      finally {
        setIsLoading(false);
      }
  };

  if (authMode === 'forgot') {
    return (
      <ForgotPassword
        onBack={() => setAuthMode('login')} 
      />
    );
  }

  if (authMode === 'reset') {
    return (
      <ResetPassword
        token={resetToken}
        onBack={() => setAuthMode('welcome')} 
        onSuccess={() => {
          setAuthMode('login');
          Alert.alert("Success", "Password reset successfully! Please log in with your new password.");
        }} 
      />
    );
  }

  return (
    <View style={styles.glowBox}>
        {errMessage ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errMessage}</Text>
        </View>
      ) : null}
        <Pressable 
        style={({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => [
          styles.titleWrapper,
          (pressed || hovered) && styles.titleWrapperHover
        ]}
      >
        {({ pressed, hovered }: { pressed: boolean; hovered?: boolean }) => (
          <Text style={[
            styles.formTitle, 
            (pressed || hovered) && styles.formTitleHover
          ]}>
            Login
          </Text>
        )}
      </Pressable>
      
      <TextInput
        style={styles.inputLight}
        placeholderTextColor="#666"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.inputLight}
        placeholderTextColor="#666"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <View style={styles.formActions}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#778ca3' }]} onPress={onBack}>
          <FontAwesome name="arrow-left" size={14} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.actionBtnText}>BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#26de81' }]} onPress={handleLogin}>
          <Text style={styles.actionBtnText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => setAuthMode('forgot')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  glowBox: {
    backgroundColor: '#050505',
    padding: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
    width: vw * 0.85,
    maxWidth: 380,
    boxShadow: '0px 0px 15px rgba(255, 0, 0, 0.8)',
    elevation: 15,
  },
  titleWrapper: {
    alignSelf: 'center', 
    marginBottom: 25,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24, 
    backgroundColor: 'transparent', 
  },
  titleWrapperHover: {
    backgroundColor: '#b84b31', 
  },
  formTitle: {
    fontSize: 36,
    color: '#ff6b81', 
    fontFamily: 'VT323_400Regular',
    textAlign: 'center',
  },
  formTitleHover: {
    color: '#ff8a75', 
  },

  inputLight: {
    backgroundColor: '#f1f2f6',
    color: '#000000',
    padding: 12,
    borderRadius: 4,
    marginBottom: 15,
    fontFamily: 'VT323_400Regular',
    fontSize: 18,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    minWidth: 110,
  },
  actionBtnText: {
    color: '#ffffff',
    fontFamily: 'VT323_400Regular',
    fontSize: 16,
  },
  forgotPassword: {
    color: '#70a1ff',
    fontFamily: 'VT323_400Regular',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  errorBanner: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#ff3860',
    padding: 10,
    borderRadius: 4,
    marginBottom: 15,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff3860',
    fontFamily: 'VT323_400Regular',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});