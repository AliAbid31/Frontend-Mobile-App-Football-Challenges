import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Pressable, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const { width: vw } = Dimensions.get('window');
import { API_URL } from '../apiConfig';

interface RegisterProps {
  onBack: () => void;
  onRegisterSuccess: () => void;
}

export default function Register({ onBack, onRegisterSuccess }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState('');


  const handleRegister = async () => {
    setErrMessage(''); // Reset au clic

    if (!username.trim() || !email.trim() || !password.trim()){
      setErrMessage("Please enter all fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      let data;
      const text = await res.text(); // On lit d'abord en texte brut
      try {
        data = JSON.parse(text); // On tente de transformer en JSON
      } catch (e) {
        data = { detail: "Server returned an invalid response" };
      }

      if (res.ok) {
        console.log("Success:", data);
        onRegisterSuccess();
      } else {
        if (typeof data.detail === 'string') {
          setErrMessage(data.detail);
        } else if (Array.isArray(data.detail)) {
          setErrMessage(data.detail[0].msg); // Premier message d'erreur de validation
        } else {
          setErrMessage("Registration failed");
        }
      }
    } catch (err) {
      console.log("Fetch Error:", err);
      setErrMessage("Network error: Check your connection");
    } finally {
      setIsLoading(false);
    } 
  };
  return (
    <View style={styles.glowBox}>
        {errMessage !== '' && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errMessage}</Text>
        </View>
        )}
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
            Register
        </Text>
        )}
        </Pressable>
      
      <TextInput
        style={styles.inputDark}
        placeholderTextColor="#888"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.inputDark}
        placeholderTextColor="#888"
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.inputDark}
        placeholderTextColor="#888"
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
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#2d98da' }]} onPress={handleRegister}>
          <Text style={styles.actionBtnText}>REGISTER</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: 'transparent', // Fond invisible au repos
  },
  titleWrapperHover: {
    backgroundColor: '#b84b31', // Le fond orange brique s'allume au survol/clic
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
  inputDark: {
    backgroundColor: '#000000',
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#2f3542',
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