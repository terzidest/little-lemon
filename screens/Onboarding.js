import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image } from 'react-native';
import CustomButton from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Onboarding({ navigation, onComplete }) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [isFirstNameValid, setIsFirstNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  useEffect(() => {
    validateFirstName(firstName);
    validateEmail(email);
  }, [firstName, email]);

  const validateFirstName = (name) => {
    setIsFirstNameValid(name.trim().length > 0);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  };

  const handleNext = async () => {
    try {
      await AsyncStorage.setItem('@first_name', firstName);
      await AsyncStorage.setItem('@email', email);
      await AsyncStorage.setItem('@logged_in', 'true');
      if (onComplete) {
        onComplete();  // Notify the parent component that onboarding is complete
      }
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>Let us get to know you</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text);
            validateFirstName(text);
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            validateEmail(text);
          }}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.footer}>
        <CustomButton
          title="Next"
          onPress={handleNext}
          disabled={!isFirstNameValid || !isEmailValid}
          style={isFirstNameValid && isEmailValid ? styles.activeButton : styles.inactiveButton}
          textStyle={isFirstNameValid && isEmailValid ? styles.activeButtonText : styles.inactiveButtonText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c1c8d2',
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: '#e1e4e9',
    height: 125,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 50,
    marginTop:20
  },
  title: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 24,
  },
  inputContainer: {
    marginHorizontal: 16,
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    paddingHorizontal: 8,
    fontSize: 18,
  },
  footer: {
    backgroundColor: '#e1e4e9',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#495E57',
  },
  inactiveButton: {
    backgroundColor: '#ccc',
  },
  activeButtonText: {
    color: 'white',
  },
  inactiveButtonText: {
    color: 'gray',
  },
});
