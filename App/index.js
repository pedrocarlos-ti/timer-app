import React, { useState, useEffect } from "react";
import { Text, View, StatusBar, TouchableOpacity, Picker } from "react-native";
import styles from "./styles";

const formatNumber = (number) => `0${number}`.slice(-2);

const getRemaining = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

// Create Picker Items based on length
const createArray = (length) => {
  const arr = [];
  let i = 0;
  while (i < length) {
    arr.push(i.toString());
    i += 1;
  }

  return arr;
};

const AVAILABLE_MINUTES = createArray(10);
const AVAILABLE_SECONDS = createArray(60);

const Pickers = ({
  selectedMinutes,
  selectedSeconds,
  setSelectedMinutes,
  setSelectedSeconds,
}) => (
  <View style={styles.pickerContainer}>
    <Picker
      style={styles.picker}
      itemStyle={styles.pickerItem}
      selectedValue={selectedMinutes}
      onValueChange={(value) => setSelectedMinutes(value)}
      mode="dropdown"
    >
      {AVAILABLE_MINUTES.map((value) => (
        <Picker.Item key={value} label={value} value={value} />
      ))}
    </Picker>

    <Text style={styles.pickerItem}>minutes</Text>
    <Picker
      style={styles.picker}
      itemStyle={styles.pickerItem}
      selectedValue={selectedSeconds}
      onValueChange={(value) => setSelectedSeconds(value)}
      mode="dropdown"
    >
      {AVAILABLE_SECONDS.map((value) => (
        <Picker.Item key={value} label={value} value={value} />
      ))}
    </Picker>
    <Text style={styles.pickerItem}>seconds</Text>
  </View>
);

// Custom button component
const Button = ({ children, ...props }) => (
  <TouchableOpacity {...props}>{children}</TouchableOpacity>
);

export default function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(5);
  const [selectedMinutes, setSelectedMinutes] = useState("0");
  const [selectedSeconds, setSelectedSeconds] = useState("5");

  const { minutes, seconds } = getRemaining(remainingSeconds);

  const start = () => {
    setRemainingSeconds(
      parseInt(selectedMinutes, 10) * 60 + parseInt(selectedSeconds, 10)
    );
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
  };

  useEffect(() => {
    let interval;

    // Play / Pause
    if (isPaused) {
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }

    // Start / Stop
    if (isRunning) {
      interval = setInterval(() => {
        setRemainingSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else {
      clearInterval(interval);
      interval = null;
      setIsRunning(false);
      setRemainingSeconds(5);
    }

    // Remove interval
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, remainingSeconds, isPaused]);

  // Reset timer
  useEffect(() => {
    if (remainingSeconds === 0) {
      stop();
    }
  }, [remainingSeconds]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {isRunning ? (
        <>
          <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>

          <Button onPress={stop} style={[styles.button, styles.buttonStop]}>
            <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
          </Button>

          {isPaused ? (
            <Button onPress={() => setIsPaused(false)}>
              <Text style={styles.pause}>Play</Text>
            </Button>
          ) : (
            <Button onPress={() => setIsPaused(true)}>
              <Text style={styles.pause}>Pause</Text>
            </Button>
          )}
        </>
      ) : (
        <>
          <Pickers
            selectedMinutes={selectedMinutes}
            setSelectedMinutes={setSelectedMinutes}
            selectedSeconds={selectedSeconds}
            setSelectedSeconds={setSelectedSeconds}
          />

          <Button onPress={start} style={styles.button}>
            <Text style={styles.buttonText}>Start</Text>
          </Button>
        </>
      )}
    </View>
  );
}
