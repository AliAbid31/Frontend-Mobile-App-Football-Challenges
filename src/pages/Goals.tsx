import React, { useEffect, useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, Dimensions, TouchableOpacity, 
  Image, ScrollView, ActivityIndicator, Alert, BackHandler, useWindowDimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import { API_URL } from '../apiConfig';
import { useFonts, Jaro_400Regular } from '@expo-google-fonts/jaro';
import { VT323_400Regular } from '@expo-google-fonts/vt323';

import { players } from '../data/players'; 

const { width: vw, height: vh } = Dimensions.get('window');

interface GameInput {
  mult: number;
  placeholder: string;
  value: string;
  locked: boolean;
}

interface GoalsChallengeProps {
  onBack: () => void;
}

export default function GoalsChallenge({ onBack }: GoalsChallengeProps) {
  const { width: vw } = useWindowDimensions();
  let [fontsLoaded] = useFonts({ 
    Jaro_400Regular,
    VT323_400Regular 
  });

  const getButtonWidth = () => {
    if (vw > 1000) return '19%'; // 5 colonnes sur grand écran PC
    if (vw > 768) return '24.5%';    // 4 colonnes sur petit PC / iPad
    if (vw > 450) return '32%';    // 3 colonnes sur grand smartphone
    return '48%';                  // 2 colonnes sur petit smartphone
  };

  const getImageSize = () => {
    if (vw > 768) return 120; // Grande image sur PC
    if (vw > 450) return 95; // Moyenne
    return 70;                // Petite sur smartphone
  };

  const [totalGoals, setTotalGoals] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState<any>(null);
  const [lockedInputsCount, setLockedInputsCount] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  
  const [displayImageName, setDisplayImageName] = useState<string>("Ronaldo");
  const [displayName, setDisplayName] = useState<string>("Cristiano Ronaldo");
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  const [gameInputs, setGameInputs] = useState<GameInput[]>([]);

  const rotationIntervalRef = useRef<any>(null);
  const rotationCountRef = useRef(0);
  const MAX_ROTATIONS = 15;

  useEffect(() => {
    initGameInputs();
    fetchLeaderboard();
    startRotation();
    return () => clearInterval(rotationIntervalRef.current);
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        onBack();
        return true; 
      }
    );

    return () => backHandler.remove(); 
  }, [onBack]);

  const initGameInputs = () => {
    const multipliers = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 7, 7, 8, 8, 10, 15, 20, 25, 30];
    const initialInputs = multipliers.map(mult => {
      let placeholder = "Career";
      switch(mult) {
        case 2: placeholder = "Double"; break;
        case 3: placeholder = "Treple"; break;
        case 4: placeholder = "Quadruple"; break;
        case 5: placeholder = "xFive"; break;
        case 7: placeholder = "xSeven"; break;
        case 8: placeholder = "xEight"; break;
        case 10: placeholder = "xTen"; break;
        case 15: placeholder = "x15"; break;
        case 20: placeholder = "x20"; break;
        case 25: placeholder = "x25"; break;
        case 30: placeholder = "x30"; break;
      }
      return { mult, placeholder, value: "", locked: false };
    });
    setGameInputs(initialInputs);
  };

  const fetchLeaderboard = async () => {
    try {
      setLoadingLeaderboard(true);
      // CORRECTION DU 404 : Ajout de /auth/
      const res = await fetch(`${API_URL}/leaderboard/goals`);
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (err) {
      console.log("Erreur Leaderboard:", err);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const startRotation = () => {
    setIsRotating(true);
    rotationCountRef.current = 0;
    clearInterval(rotationIntervalRef.current);

    rotationIntervalRef.current = setInterval(() => {
      const randomNumber = Math.floor(Math.random() * players.length);
      const newPlayer = players[randomNumber];
      setCurrentPlayer(newPlayer);
      
      if (newPlayer) {
        setDisplayImageName(newPlayer.name2);
        setDisplayName(newPlayer.name);
      }

      rotationCountRef.current++;
      if (rotationCountRef.current >= MAX_ROTATIONS) {
        setIsRotating(false);
        clearInterval(rotationIntervalRef.current);
      }
    }, 150);
  };

  const handleInputClick = (index: number) => {
    if (gameInputs[index].locked || isRotating || gameStatus !== 'playing') return;
    
    if (!currentPlayer || currentPlayer.goals === undefined) {
      Alert.alert("Error", "Player data not loaded. Please wait.");
      return;
    }

    const goalsToAdd = currentPlayer.goals * gameInputs[index].mult;
    const newTotal = totalGoals + goalsToAdd;
    setTotalGoals(newTotal);

    const newInputs = [...gameInputs];
    newInputs[index].value = `${newInputs[index].placeholder} (${currentPlayer.name}) : ${goalsToAdd}`;
    newInputs[index].locked = true;
    setGameInputs(newInputs);

    const newLockedCount = lockedInputsCount + 1;
    setLockedInputsCount(newLockedCount);

    if (newLockedCount === gameInputs.length) {
      if (newTotal >= 100000) {
        setGameStatus('won');
        saveScore(newTotal);
      } else {
        setGameStatus('lost');
      }
    } else {
      startRotation();
    }
  };

  const saveScore = async (finalScore: number) => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    try {
      // CORRECTION : Ajout de /auth/
      const res = await fetch(`${API_URL}/challenges/score`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ score: finalScore, type: 'goals' })
      });
      
      if (res.ok) {
        fetchLeaderboard(); 
      }
    } catch (err) {
      console.log("Erreur sauvegarde:", err);
    }
  };

  const restartGame = () => {
    setTotalGoals(0);
    setLockedInputsCount(0);
    setGameStatus('playing');
    initGameInputs();
    startRotation();
  };

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E1219E" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* 1. TITRE ET BOUTON HELP */}
      <View style={styles.headerContainer}>
        <Text style={styles.mainTitle}>100 000 GOALS CHALLENGE</Text>
        <TouchableOpacity style={styles.helpTrigger} onPress={() => setShowHelp(!showHelp)}>
          <FontAwesome5 name="question-circle" size={24} color={showHelp ? 'pink' : '#00aaff'} />
        </TouchableOpacity>
      </View>

      {showHelp && (
        <View style={styles.helpBox}>
          <Text style={styles.helpText}>
            <Text>Concept:</Text>{'\n'}
            Click on the inputs to add goals based on the player's stats.{'\n'}
            Each input has a multiplier (Career, Double, xFive, etc.).{'\n'}
            The goal is to reach 100,000 goals before all inputs are used.{'\n'}
            Good luck!
          </Text>
        </View>
      )}

      {/* 2. LEADERBOARD */}
      <View style={styles.leaderboardBox}>
        <Text style={styles.leaderboardTitle}>Top Goals Scores (Objectif: 100 000+)</Text>
        {loadingLeaderboard ? (
          <Text style={styles.leaderboardEmpty}>Chargement...</Text>
        ) : leaderboard.length > 0 ? (
          leaderboard.map((player, index) => (
            <View key={index} style={styles.leaderboardRow}>
              <Text style={styles.leaderboardName}>{player.username}</Text>
              <Text style={styles.leaderboardScore}>{player.score.toLocaleString()} goals</Text>
            </View>
          ))
        ) : (
          <Text style={styles.leaderboardEmpty}>No Score for the moment &gt; 100 000</Text>
        )}
      </View>

      {/* 3. BOUTON RESTART (Gris, centré) */}
      <TouchableOpacity style={styles.restartBtn} onPress={restartGame}>
        <FontAwesome5 name="sync-alt" size={16} color="#00aaff" />
        <Text style={styles.restartBtnText}>Restart</Text>
      </TouchableOpacity>

      {/* 4. IMAGE ET NOM DU JOUEUR */}
      <View style={styles.playerSection}>
        <Image 
          source={currentPlayer ? currentPlayer.image : require('../../assets/icons_processed/processed_Ronaldo.png')} 
          style={[styles.playerImage,
            { width: getImageSize(), height: getImageSize() }
          ]}
        />
        <Text style={styles.playerName}>{displayName}</Text>
      </View>

      <View style={styles.inputsContainer}>
        {gameInputs.map((item, index) => (
          <TouchableOpacity 
              key={index} 
              style={[
              styles.inputButton, 
              { width: getButtonWidth() }, 
              item.locked && styles.inputButtonLocked,
              gameStatus === 'lost' && styles.inputButtonLost // <--- Ajout ici
              ]}
              onPress={() => handleInputClick(index)}
              activeOpacity={0.7}
          >
              {item.locked ? (
              <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  contentContainerStyle={styles.scrollTextContainer}
              >
                  <Text style={[
                  styles.inputButtonTextLocked,
                  gameStatus === 'lost' && styles.inputButtonTextLost // <--- Texte en rouge si perdu
                  ]}>
                  {item.value}
                  </Text>
              </ScrollView>
              ) : (
              <Text style={[
                  styles.inputButtonText,
                  gameStatus === 'lost' && styles.inputButtonTextLost // <--- Texte en rouge si perdu
              ]}>
                  {item.placeholder}
              </Text>
              )}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[
        styles.scoreDisplay,
        gameStatus === 'won' ? { color: '#00ffaa' } : 
        gameStatus === 'lost' ? { color: '#ff3860' } : 
        { color: 'aquamarine' }
      ]}>
        Goals : {totalGoals} {gameStatus === 'lost' && "- You Lost!"} {gameStatus === 'won' && "- WINNER!"}
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: '2%', // Marges fluides
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  mainTitle: {
    fontSize: vw > 600 ? 40 : 28,
    color: '#E1219E',
    fontFamily: 'Jaro_400Regular', 
    textAlign: 'center',
  },
  helpTrigger: {
    position: 'absolute',
    right: 10,
    top: 0,
  },
  helpBox: {
    backgroundColor: 'rgba(10, 10, 20, 0.95)',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00aaff',
    marginBottom: 20,
    width: '90%',
    maxWidth: 600,
  },
  helpText: {
    color: '#00ffaa',
    fontFamily: 'monospace',
    lineHeight: 22,
  },
  leaderboardBox: {
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00aaff',
    width: '80%',
    maxWidth: 600,
    marginBottom: 20,
  },
  leaderboardTitle: {
    color: '#c0920a',
    fontSize: 18,
    fontFamily: 'Jaro_400Regular',
    marginBottom: 10,
    textAlign: 'center',
  },
  leaderboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 4,
  },
  leaderboardName: {
    color: 'white',
    fontFamily: 'Jaro_400Regular',
    fontSize: 18,
  },
  leaderboardScore: {
    color: '#00ffaa',
    fontFamily: 'Jaro_400Regular',
    fontSize: 18,
  },
  leaderboardEmpty: {
    color: '#aaa',
    fontFamily: 'Jaro_400Regular',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  restartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a59e9e', // Gris
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#dbcdcd',
    alignSelf: 'center', // Le centre
    marginBottom: 30,
  },
  restartBtnText: {
    color: '#000',
    fontFamily: 'Jaro_400Regular',
    marginLeft: 8,
    fontSize: 18,
  },
  playerSection: {
    alignItems: 'center', // Centre image et nom
    marginBottom: 20,
  },
  playerImage: {
    borderRadius: 10,
    marginBottom: 10,
  },
  playerName: {
    color: '#00aaff',
    fontFamily: 'Jaro_400Regular',
    fontSize: 22,
    marginTop: 10,
  },
  inputsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8, 
    width: '100%',
    marginBottom: 30,
  },
  inputButton: {
    height: 25, // 1. FIXER LA HAUTEUR OBLIGATOIREMENT (empêche de grandir)
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#00aaff',
    borderRadius: 5,
    justifyContent: 'center', // Centre verticalement
    alignItems: 'center', // Centre horizontalement (pour le texte court)
    overflow: 'hidden', // 2. Empêche le texte de déborder visuellement du cadre
  },
  inputButtonLocked: {
    backgroundColor: 'rgba(0, 255, 170, 0.1)',
    borderColor: '#00ffaa',
    alignItems: 'flex-start', 
  },
  scrollTextContainer: {
    flexGrow: 1,
    alignItems: 'center', // Centre verticalement le texte dans le scroll
    paddingHorizontal: 8, // Ajoute un petit espace à gauche et à droite du texte défilant
  },

  inputButtonText: {
    color: '#aaa', 
    fontFamily: 'Jaro_400Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  inputButtonTextLocked: {
    color: '#00ffaa',
    fontFamily: 'Jaro_400Regular',
    fontSize: 14,
  },
  scoreDisplay: {
    fontSize: 36,
    fontFamily: 'Jaro_400Regular',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputButtonLost: {
    borderColor: '#ff3860',
    backgroundColor: 'rgba(255, 56, 96, 0.1)', 
  },
  inputButtonTextLost: {
    color: '#ff3860',
  }
});