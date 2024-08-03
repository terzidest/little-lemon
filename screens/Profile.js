import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation} from '@react-navigation/native';
import { clearSQLiteData } from '../database'; 
import { Ionicons } from '@expo/vector-icons'; 
import CustomButton from '../components/Button';
import Checkbox from '../components/Checkbox';
import { useAppContext } from '../AppContext';


const getInitials = (firstName, lastName) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^(?:\+1)?\d{10}$/;
  return phoneRegex.test(phoneNumber);
};

const CustomHeader = ({ firstName, lastName, avatar }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.customHeader}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatarSmall} />
      ) : (
        <View style={styles.avatarPlaceholderSmall}>
          <Text style={styles.avatarPlaceholderTextSmall}>{getInitials(firstName, lastName)}</Text>
        </View>
      )}
    </View>
  );
};

export default function Profile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [notifications, setNotifications] = useState({
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
  });
  const navigation = useNavigation();

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedFirstName = await AsyncStorage.getItem('@first_name');
        const storedLastName = await AsyncStorage.getItem('@last_name');
        const storedEmail = await AsyncStorage.getItem('@email');
        const storedPhone = await AsyncStorage.getItem('@phone');
        const storedAvatar = await AsyncStorage.getItem('@avatar');
        const storedNotifications = await AsyncStorage.getItem('@notifications');
        
        if (storedFirstName) setFirstName(storedFirstName);
        if (storedLastName) setLastName(storedLastName);
        if (storedEmail) setEmail(storedEmail);
        if (storedPhone) setPhone(storedPhone);
        if (storedAvatar) setAvatar(storedAvatar);
        if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
      } catch (error) {
        console.error(error);
      }
    };

    loadProfileData();
  }, []);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Permission to access media library is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setAvatar(result.assets[0].uri);
      try {
        await AsyncStorage.setItem('@avatar', result.assets[0].uri);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatar(null);
    try {
      await AsyncStorage.removeItem('@avatar');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveChanges = async () => {
    if (!validatePhoneNumber(phone)) {
      Alert.alert('Invalid phone number', 'Please enter a valid USA phone number.');
      return;
    }

    try {
      await AsyncStorage.setItem('@first_name', firstName);
      await AsyncStorage.setItem('@last_name', lastName);
      await AsyncStorage.setItem('@email', email);
      await AsyncStorage.setItem('@phone', phone);
      if (avatar) {
        await AsyncStorage.setItem('@avatar', avatar);
      } else {
        await AsyncStorage.removeItem('@avatar');
      }
      await AsyncStorage.setItem('@notifications', JSON.stringify(notifications));
      Alert.alert('Success', 'Your changes have been saved.');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDiscardChanges = async () => {
    try {
      const storedFirstName = await AsyncStorage.getItem('@first_name');
      const storedLastName = await AsyncStorage.getItem('@last_name');
      const storedEmail = await AsyncStorage.getItem('@email');
      const storedPhone = await AsyncStorage.getItem('@phone');
      const storedAvatar = await AsyncStorage.getItem('@avatar');
      const storedNotifications = await AsyncStorage.getItem('@notifications');

      if (storedFirstName) setFirstName(storedFirstName);
      if (storedLastName) setLastName(storedLastName);
      if (storedEmail) setEmail(storedEmail);
      if (storedPhone) setPhone(storedPhone);
      if (storedAvatar) setAvatar(storedAvatar);
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
    } catch (error) {
      console.error(error);
    }
  };
  
  const { setSelectedItems } = useAppContext();

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      await clearSQLiteData();
      setSelectedItems([]);
      navigation.replace('Onboarding');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomHeader firstName={firstName} lastName={lastName} avatar={avatar} />
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <Text style={styles.avatarLabel}>Avatar</Text>
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatarLarge} />
        ) : (
          <View style={styles.avatarPlaceholderLarge}>
            <Text style={styles.avatarPlaceholderTextLarge}>{getInitials(firstName, lastName)}</Text>
          </View>
        )}
        <View style={styles.avatarButtons}>
          <CustomButton title="Change" onPress={handleImagePick} style={styles.changeButton} textStyle={styles.changeButtonText} />
          <CustomButton title="Remove" onPress={handleRemoveAvatar} style={styles.removeButton} textStyle={styles.removeButtonText} />
        </View>
      </View>
      <TextInput 
        style={styles.input} 
        placeholder="First Name" 
        value={firstName} 
        onChangeText={setFirstName} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Last Name" 
        value={lastName} 
        onChangeText={setLastName} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Phone Number" 
        value={phone} 
        onChangeText={setPhone} 
        keyboardType="phone-pad" 
      />
      <Text style={styles.sectionTitle}>Email Notifications</Text>
      <View style={styles.checkboxContainer}>
        <Checkbox 
          label="Order Statuses" 
          value={notifications.orderStatuses} 
          onValueChange={(value) => setNotifications({ ...notifications, orderStatuses: value })} 
        />
        <Checkbox 
          label="Password Changes" 
          value={notifications.passwordChanges} 
          onValueChange={(value) => setNotifications({ ...notifications, passwordChanges: value })} 
        />
        <Checkbox 
          label="Special Offers" 
          value={notifications.specialOffers} 
          onValueChange={(value) => setNotifications({ ...notifications, specialOffers: value })} 
        />
        <Checkbox 
          label="Newsletter" 
          value={notifications.newsletter} 
          onValueChange={(value) => setNotifications({ ...notifications, newsletter: value })} 
        />
      </View>
      <CustomButton title="Logout" onPress={handleLogout} style={styles.logoutButton} textStyle={styles.logoutButtonText} />
      <View style={styles.buttonRow}>
        <CustomButton title="Discard Changes" onPress={handleDiscardChanges} style={styles.discardButton} textStyle={styles.discardButtonText} />
        <CustomButton title="Save Changes" onPress={handleSaveChanges} style={styles.saveButton} textStyle={styles.saveButtonText} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
    marginTop: 10,
  },
  logo: {
    width: 200,
    height: 50,
  },
  avatarSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholderSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderTextSmall: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  avatarLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarLarge: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginRight: 10,
  },
  avatarPlaceholderLarge: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarPlaceholderTextLarge: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  avatarButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
  },
  changeButton: {
    backgroundColor: '#495E57',
    marginRight: 10,
    width: 125,
  },
  changeButtonText: {
    color: 'white',
    fontSize: 14,
  },
  removeButton: {
    backgroundColor: 'white',
    borderColor: '#495E57',
    borderWidth: 1,
    width: 125,
  },
  removeButtonText: {
    color: '#495E57',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  checkboxContainer: {
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
  },
  logoutButton: {
    backgroundColor: '#F4CE14',
    marginTop: 10,
    marginBottom: 10,
  },
  logoutButtonText: {
    color: 'black',
  },
  discardButton: {
    backgroundColor: 'white',
    borderColor: '#495E57',
    borderWidth: 1,
    marginRight: 10,
    width: 170,
    height: 50,
  },
  discardButtonText: {
    color: '#495E57',
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: '#495E57',
    width: 170,
    height: 50,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 12,
  },
});
