import React, { useEffect, useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, Dimensions, TouchableOpacity, 
  Image, ScrollView, Alert, BackHandler, useWindowDimensions, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import { API_URL } from '../apiConfig';
import { useFonts, Jaro_400Regular } from '@expo-google-fonts/jaro';

// Importation des clubs
import { clubs } from '../data/clubs'; 

const { width: screenWidth } = Dimensions.get('window');

interface GameInput {
  property: string;
  mult: number;
  placeholder: string;
  value: string;
  locked: boolean;
}

export default function TrophiesChallenge({ onBack }: { onBack: () => void }) {
  const { width: vw } = useWindowDimensions();
  let [fontsLoaded] = useFonts({ Jaro_400Regular });

  const [totalTrophies, setTotalTrophies] = useState(0);
  const [currentClub, setCurrentClub] = useState<any>(null);
  const [lockedInputsCount, setLockedInputsCount] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [gameInputs, setGameInputs] = useState<GameInput[]>([]);

  const rotationIntervalRef = useRef<any>(null);
  const rotationCountRef = useRef(0);
  const MAX_ROTATIONS = 15;
  const CHALLENGE_GOAL = 1000;

  const getButtonWidth = () => {
    if (vw > 1000) return '19%'; // 5 colonnes sur grand écran PC
    if (vw > 768) return '24.5%';    // 4 colonnes sur petit PC / iPad
    if (vw > 450) return '32%';    // 3 colonnes sur grand smartphone
    return '48%';                  // 2 colonnes sur petit smartphone
  };

  useEffect(() => {
    initGameInputs(); // Créer les boutons
    fetchLeaderboard(); // Charger le score
    startRotation(); // Choisir le premier club
    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true; 
    });

    return () => {
      backHandler.remove();
      clearInterval(rotationIntervalRef.current);
    };
  }, []);

  const initGameInputs = () => {
    const config = [
        { property: 'PLs', mult: 1, placeholder: "Premier-Leagues" },
        { property: 'PLs', mult: 2, placeholder: "2xPLs" },
        { property: 'PLs', mult: 3, placeholder: "3xPLs" },
        { property: 'Laliga', mult: 1, placeholder: "Laligas" },
        { property: 'Laliga', mult: 2, placeholder: "2xLaligas" },
        { property: 'Bundesliga', mult: 1, placeholder: "Bundesligas" },
        { property: 'Bundesliga', mult: 2, placeholder: "2xBundes" },
        { property: 'SerieA', mult: 1, placeholder: "SerieA" },
        { property: 'SerieA', mult: 2, placeholder: "2xSerieA" },
        { property: 'Ligue1', mult: 1, placeholder: "Ligue1" },
        { property: 'Ligue1', mult: 2, placeholder: "2xLigue1" },
        { property: 'ChampionsLeagues', mult: 1, placeholder: "UCLs" },
        { property: 'ChampionsLeagues', mult: 2, placeholder: "2xUCLs" },
        { property: 'Leagues', mult: 1, placeholder: "Leagues" },
        { property: 'Leagues', mult: 2, placeholder: "2xLeagues" },
        { property: 'Leagues', mult: 3, placeholder: "3xLeagues" },
        { property: 'Leagues', mult: 4, placeholder: "4xLeagues" },
        { property: 'DomesticCups', mult: 1, placeholder: "Dom. Cups" },
        { property: 'DomesticCups', mult: 2, placeholder: "2xDom. Cups" },
        { property: 'DomesticCups', mult: 3, placeholder: "3xDom. Cups" },
        { property: 'InternationalCups', mult: 1, placeholder: "Int. Cups" },
        { property: 'InternationalCups', mult: 2, placeholder: "2xInt. Cups" },
        { property: 'Total', mult: 1, placeholder: "Total" },
        { property: 'Total', mult: 1, placeholder: "Total" },
        { property: 'Total', mult: 1, placeholder: "Total" },
    ];
    setGameInputs(config.map(item => ({ ...item, value: "", locked: false })));
  };

  const startRotation = () => {
    setIsRotating(true);
    rotationCountRef.current = 0;
    clearInterval(rotationIntervalRef.current);

    rotationIntervalRef.current = setInterval(() => {
      const randomNumber = Math.floor(Math.random() * clubs.length);
      setCurrentClub(clubs[randomNumber]);

      rotationCountRef.current++;
      if (rotationCountRef.current >= MAX_ROTATIONS) {
        setIsRotating(false);
        clearInterval(rotationIntervalRef.current);
      }
    }, 120);
  };

  const handleInputClick = (index: number) => {
    if (gameInputs[index].locked || isRotating || gameStatus !== 'playing' || !currentClub) return;

    // SÉCURITÉ : On vérifie si la propriété existe, sinon on met 0
    const rawVal = currentClub[gameInputs[index].property];
    const trophiesValue = parseInt(rawVal) || 0; 
    
    const trophiesToAdd = trophiesValue * gameInputs[index].mult;
    const newTotal = totalTrophies + trophiesToAdd;

    const newInputs = [...gameInputs];
    newInputs[index].value = `${newInputs[index].placeholder} (${currentClub.name}): ${trophiesToAdd}`;
    newInputs[index].locked = true;
    
    setTotalTrophies(newTotal);
    setGameInputs(newInputs);
    const newCount = lockedInputsCount + 1;
    setLockedInputsCount(newCount);

    if (newCount === 25) {
      if (newTotal >= CHALLENGE_GOAL) {
        setGameStatus('won');
        saveScore(newTotal);
      } else {
        setGameStatus('lost');
      }
    } else {
      startRotation();
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoadingLeaderboard(true);
      const res = await fetch(`${API_URL}/leaderboard/trophies`);
      if (res.ok) setLeaderboard(await res.json());
    } catch (err) { console.log(err); } 
    finally { setLoadingLeaderboard(false); }
  };

  const saveScore = async (score: number) => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;
    try {
      await fetch(`${API_URL}/challenges/score`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ score, type: 'trophies' })
      });
      fetchLeaderboard();
    } catch (err) { console.log(err); }
  };

  if (!fontsLoaded) return <ActivityIndicator size="large" color="white" style={{flex:1, backgroundColor:'black'}}/>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.mainTitle}>1 000 TROPHIES CHALLENGE</Text>

      <View style={styles.leaderboardBox}>
        <Text style={styles.leaderboardTitle}>Top Trophies (Objectif: 1 000+)</Text>
        {loadingLeaderboard ? <Text style={styles.leaderboardEmpty}>Loading...</Text> : 
          leaderboard.map((p, i) => (
            <View key={i} style={styles.leaderboardRow}>
              <Text style={styles.leaderboardName}>{p.username}</Text>
              <Text style={styles.leaderboardScore}>{p.score} trophies</Text>
            </View>
          ))
        }
      </View>

      <TouchableOpacity style={styles.restartBtn} onPress={() => { setTotalTrophies(0); setLockedInputsCount(0); setGameStatus('playing'); initGameInputs(); startRotation(); }}>
        <FontAwesome5 name="sync-alt" size={16} color="#00aaff" />
        <Text style={styles.restartBtnText}>Restart</Text>
      </TouchableOpacity>

      <View style={styles.playerSection}>
        {currentClub && (
          <Image 
            source={currentClub.image} 
            style={{ width: 100, height: 100 }}
            resizeMode="contain"
          />
        )}
        <Text style={styles.playerName}>{currentClub?.name || "Loading..."}</Text>
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

      <Text style={[styles.scoreDisplay, { color: gameStatus === 'won' ? '#00ffaa' : gameStatus === 'lost' ? '#ff3860' : 'aquamarine' }]}>
        Trophies : {totalTrophies}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#000', alignItems: 'center', paddingVertical: 20 },
  mainTitle: { fontSize: 28, color: 'rgb(30, 181, 181)', fontFamily: 'Jaro_400Regular', marginBottom: 20 },
  leaderboardBox: { backgroundColor: '#111', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#00aaff', width: '80%', maxWidth: 600, marginBottom: 20 },
  leaderboardTitle: { color: '#f39c12', fontFamily: 'Jaro_400Regular', textAlign: 'center', marginBottom: 10 },
  leaderboardRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 },
  leaderboardName: { color: 'white', fontFamily: 'Jaro_400Regular' },
  leaderboardScore: { color: '#00ffaa', fontFamily: 'Jaro_400Regular' },
  leaderboardEmpty: { color: '#888', textAlign: 'center' },
  restartBtn: { flexDirection: 'row', backgroundColor: '#333', padding: 10, borderRadius: 8, marginBottom: 20, alignItems: 'center' },
  restartBtnText: { color: '#00aaff', fontFamily: 'Jaro_400Regular', marginLeft: 10 },
  playerSection: { alignItems: 'center', marginBottom: 20 },
  playerName: { color: '#00aaff', fontFamily: 'Jaro_400Regular', fontSize: 22, marginTop: 10 },
  inputsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, width: '100%', maxWidth: 900 },
  inputButton: { height: 35, backgroundColor: '#111', borderWidth: 1, borderColor: '#00aaff', borderRadius: 5, justifyContent: 'center', alignItems: 'center' },
  inputButtonLocked: { borderColor: '#00ffaa', backgroundColor: 'rgba(0,255,170,0.1)' },
  inputButtonText: { color: '#b0c4de', fontFamily: 'Jaro_400Regular', fontSize: 12 },
  scoreDisplay: { fontSize: 36, fontFamily: 'Jaro_400Regular', marginTop: 20, marginBottom: 40 },
  inputButtonLost: {
    borderColor: '#ff3860',
    backgroundColor: 'rgba(255, 56, 96, 0.1)', // Optionnel : un léger fond rouge transparent
  },
  inputButtonTextLost: {
    color: '#ff3860',
  },
  inputButtonTextLocked: {
    color: '#00ffaa',
    fontFamily: 'Jaro_400Regular',
    fontSize: 14,
  },
  scrollTextContainer: {
    flexGrow: 1,
    alignItems: 'center', 
    paddingHorizontal: 8,
  },
});