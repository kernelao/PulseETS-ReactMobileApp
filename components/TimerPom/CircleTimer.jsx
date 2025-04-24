import React, { useState, useRef, useEffect } from 'react';

import { Dimensions } from 'react-native';
const { width: screenWidth } = Dimensions.get('window');
import { View, Text, TouchableOpacity, StyleSheet, Switch, Pressable } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Audio } from 'expo-av';

import AsyncStorage from '@react-native-async-storage/async-storage';

const CirclePom = () => {
  
  const [startTime, setStartTime] = useState(null);
  const [mode, setMode] = useState('pomodoro');
  const [isPlaying, setIsPlaying] = useState(false);
  const [auto, setAuto] = useState(false);
  const [autoActive, setAutoActive] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const alarmSound = useRef(null);

  const duration = {
    pomodoro: 25 * 60,
    pauseCourte: 5 * 60,
    pauseLongue: 15 * 60,
  };

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(require('./alarmepulse.mp3'));
      alarmSound.current = sound;
    };
    loadSound();

    return () => {
      if (alarmSound.current) {
        alarmSound.current.unloadAsync();
      }
    };
  }, []);

  const stopAlarm = async () => {
    if (alarmSound.current) {
      await alarmSound.current.stopAsync();
      await alarmSound.current.setPositionAsync(0);
    }
  };

  const playAlarm = async () => {
    if (alarmSound.current) {
      await alarmSound.current.replayAsync();
      setTimeout(() => stopAlarm(), 5500);
    }
  };

  const handleStart = () => {
    if (auto) setAutoActive(true);
    setStartTime(new Date());
    setIsPlaying(true);
  };

  const handlePause = () => setIsPlaying(false);

  const handleReset = () => {
    setIsPlaying(false);
    setMode('pomodoro');
    setPomodoroCount(0);
    setTimerKey(prev => prev + 1);
    stopAlarm();
    setAutoActive(false);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsPlaying(false);
    setTimerKey(prev => prev + 1);
    stopAlarm();
  };

  const handleAutoToggle = () => {
    setAuto(prev => {
      if (prev) setAutoActive(false);
      return !prev;
    });
  };
  
  const sendSessionToAPI = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.warn('Token manquant.');
        return;
      }
  
      const sessionData = {
        startedAt: startTime?.toISOString(), 
        endedAt: new Date().toISOString(),
        pomodoros_completes: pomodoroCount,
        pomodoroDuration: duration.pomodoro,
        shortBreak: duration.pauseCourte,
        longBreak: duration.pauseLongue,
        autoStart: auto,
      };
  
      const response = await fetch('http://192.168.X.X:8000/api/pomodoro-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(sessionData),
      });
  
      if (!response.ok) {
        const text = await response.text(); 
        console.error(`Erreur API (${response.status}): ${text}`);
        return;
      }
  
      console.log('Session envoyée avec succès.');
    } catch (error) {
      console.error('Erreur réseau :', error.message);
    }
  };

  const handleComplete = async () => {
    await playAlarm();
    await sendSessionToAPI(); 

    const nextState = () => {
      if (mode === 'pomodoro') {
        const nextCount = pomodoroCount + 1;
        if (nextCount >= 4) {
          setPomodoroCount(0);
          return 'pauseLongue';
        } else {
          setPomodoroCount(nextCount);
          return 'pauseCourte';
        }
      } else {
        return 'pomodoro';
      }
    };

    const nextMode = nextState();
    setMode(nextMode);
    setTimerKey(prev => prev + 1);

    if (auto && autoActive) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }

    return { shouldRepeat: false };
  };

  

  const renderTime = ({ remainingTime }) => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    return (
      <Text style={styles.textCercle}>
        {`${minutes}:${seconds.toString().padStart(2, '0')}`}
      </Text>
    );
  };

  return (
    <View style={styles.cercleMain}>
      <View style={styles.btnTimerContainer}>
        {['pomodoro', 'pauseCourte', 'pauseLongue'].map(btn => (
          <TouchableOpacity
            key={btn}
            style={[
              styles.timerBtn,
              mode === btn && styles.activeModeButton
            ]}
            onPress={() => handleModeChange(btn)}
          >
            <Text style={styles.modeButtonText}>
              {btn === 'pomodoro' ? 'Pomodoro' : btn === 'pauseCourte' ? 'Pause Courte' : 'Pause Longue'}
            </Text>

            <Pressable onPress={sendSessionToAPI} style={styles.animatedBtn}>
  <Text style={styles.animatedBtnText}>Tester Connexion API</Text>
</Pressable>
          </TouchableOpacity>

          
        ))}
      </View>

      <View style={styles.cercleBox}>
        <CountdownCircleTimer
          key={timerKey}
          isPlaying={isPlaying}
          duration={duration[mode]}
          colors={['#10217f', '#091245', '#060B26']}
          colorsTime={[duration[mode], duration[mode] / 2, 5]}
          onComplete={handleComplete}
        >
          {renderTime}
        </CountdownCircleTimer>
      </View>

      <View style={styles.buttonSrtContainer}>
        {[
          { label: 'Démarrer', onPress: handleStart },
          { label: 'Pause', onPress: handlePause },
          { label: 'Réinitialiser', onPress: handleReset }
        ].map((btn, index) => (
          <Pressable
            key={index}
            onPress={btn.onPress}
            style={({ pressed }) => [
              styles.animatedBtn,
              pressed && styles.animatedBtnPressed
            ]}
          >
            <Text style={styles.animatedBtnText}>{btn.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.autoCont}>
        <Text>Mode automatique</Text>
        <Switch value={auto} onValueChange={handleAutoToggle} />
      </View>

      <View style={styles.txtPomConsecutif}>
        <Text style={{ fontWeight: 'bold' }}>Pomodoros consécutifs : {pomodoroCount} / 4</Text>
      </View>
    </View>
  );
};

export default CirclePom;

const styles = StyleSheet.create({
  cercleMain: {
    backgroundColor: 'white',
    marginTop: 30,
    marginHorizontal: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 16,
    gap: 16,
  },
  btnTimerContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  timerBtn: {
    borderRadius: 10,
    width: screenWidth * 0.4,
    minWidth: 120,
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
    backgroundColor: '#10217f', // inactif par défaut
  },
  activeModeButton: {
    backgroundColor: '#6979cf', // actif
  },
  modeButtonText: {
    color: 'white',
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  cercleBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  textCercle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonSrtContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  animatedBtn: {
    backgroundColor: '#10217f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  animatedBtnPressed: {
    backgroundColor: '#6979cf',
    transform: [{ scale: 0.96 }],
  },
  animatedBtnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  autoCont: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  txtPomConsecutif: {
    marginTop: 10,
    alignItems: 'center',
  },
});