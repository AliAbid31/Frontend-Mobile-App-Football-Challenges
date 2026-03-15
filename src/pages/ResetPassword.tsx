import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Alert, 
  ActivityIndicator,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { API_URL } from '../apiConfig';

interface ResetPasswordProps {
  token: string;
  onBack: () => void;
  onSuccess: () => void;
}

export default function ResetPassword({ token, onBack, onSuccess }: ResetPasswordProps) {
  const { width: vw } = useWindowDimensions();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    console.log("--- CLIC SUR RESET ---");
    console.log("URL de destination:", `${API_URL}/reset-password/${token}`);
    if (!newPassword || !confirmPassword) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Erreur", "Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Succès", "Le mot de passe a été réinitialisé !");
        onSuccess();
      } else {
        Alert.alert("Erreur", data.detail || "Le lien est invalide ou expiré");
      }
    } catch (err) {
      Alert.alert("Erreur", "Impossible de contacter le serveur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.mainWrapper}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        <View style={[styles.glowBox, { width: vw * 0.9 }]}>
          <Text style={[styles.formTitle, { fontSize: vw > 400 ? 32 : 26 }]}>
            Password Reset !
          </Text>

          <TextInput
            style={styles.inputDark}
            placeholder="New Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TextInput
            style={styles.inputDark}
            placeholder="Confirm New Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <View style={styles.formActions}>
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: '#778ca3' }]} 
              onPress={onBack}
            >
              <FontAwesome name="arrow-left" size={14} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.actionBtnText}>RETOUR</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: '#26de81' }]} 
              onPress={handleReset}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.actionBtnText}>RESET PASSWORD</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#000',
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  glowBox: {
    backgroundColor: '#050505',
    padding: 25,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.4)',
    maxWidth: 420,
    alignSelf: 'center',
    // Glow effect
    shadowColor: "#ff0000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  formTitle: {
    color: '#ff6b6b',
    fontFamily: 'VT323_400Regular',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputDark: {
    backgroundColor: '#000000',
    color: '#ffffff',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
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
    paddingVertical: 12,
    borderRadius: 6,
    minHeight: 50,
  },
  actionBtnText: {
    color: '#ffffff',
    fontFamily: 'VT323_400Regular',
    fontSize: 15,
    textAlign: 'center',
  },
});