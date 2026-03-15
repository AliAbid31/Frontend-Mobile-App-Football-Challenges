import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { API_URL } from '../apiConfig';

const { width: vw } = Dimensions.get('window');

interface ForgotPasswordProps {
  onBack: () => void;
}

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setErrMessage('');
    setSuccessMessage('');
    
    if (!email.trim()) {
      setErrMessage("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccessMessage("If an account exists, a link has been sent.");
      } else {
        setErrMessage(data.detail || "An error occurred");
      }
    } catch (err) {
      setErrMessage("Connection error to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.glowBox}>
      {/* BANNIÈRE D'ERREUR (Même style que Login) */}
      {errMessage ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errMessage}</Text>
        </View>
      ) : null}

      {/* BANNIÈRE DE SUCCÈS */}
      {successMessage ? (
        <View style={[styles.errorBanner, { borderColor: '#26de81', backgroundColor: 'rgba(38, 222, 129, 0.1)' }]}>
          <Text style={[styles.errorText, { color: '#26de81' }]}>{successMessage}</Text>
        </View>
      ) : null}

      <Pressable 
        style={({ pressed, hovered }: any) => [
          styles.titleWrapper,
          (pressed || hovered) && styles.titleWrapperHover
        ]}
      >
        <Text style={styles.formTitle}>Forgot Password?</Text>
      </Pressable>
      
      <TextInput
        style={styles.inputLight}
        placeholderTextColor="#666"
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      
      <View style={styles.formActions}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#778ca3' }]} onPress={onBack}>
          <FontAwesome name="arrow-left" size={14} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.actionBtnText}>BACK</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionBtn, { backgroundColor: '#26de81' }]} 
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.actionBtnText}>SEND LINK</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onBack} style={{ marginTop: 20 }}>
        <Text style={styles.backToLogin}>Back to Login</Text>
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
    fontSize: vw < 400 ? 28 : 34,
    color: '#ff6b81', 
    fontFamily: 'VT323_400Regular',
    textAlign: 'center',
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
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 4,
    minHeight: 45,
  },
  actionBtnText: {
    color: '#ffffff',
    fontFamily: 'VT323_400Regular',
    fontSize: 16,
    textAlign: 'center',
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
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backToLogin: {
    color: '#70a1ff',
    fontFamily: 'VT323_400Regular',
    textAlign: 'center',
    fontSize: 16,
    textDecorationLine: 'underline',
  }
});