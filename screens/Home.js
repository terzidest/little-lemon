import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { fetchMenuFromDB, saveMenuToDB, filterMenuByCategoryAndSearchTerm  } from '../database';
import { useAppContext } from '../AppContext';
import debounce from 'lodash.debounce';


const getInitials = (firstName, lastName) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const CustomHeader = ({ firstName, lastName, avatar}) => {
  const navigation = useNavigation(); 

  return (
    <View style={styles.customHeader}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatarSmall} />
        ) : (
          <View style={styles.avatarPlaceholderSmall}>
            <Text style={styles.avatarPlaceholderTextSmall}>{getInitials(firstName, lastName)}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default function Home() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuItems,setMenuItems] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { selectedItems, setSelectedItems } = useAppContext();
  const navigation = useNavigation();

  const loadProfileData = async () => {
    try {
      const storedFirstName = await AsyncStorage.getItem('@first_name');
      const storedLastName = await AsyncStorage.getItem('@last_name');
      const storedAvatar = await AsyncStorage.getItem('@avatar');

      if (storedFirstName) {
        setFirstName(storedFirstName)
      } else {
        setFirstName('');
      }
      if (storedLastName){
        setLastName(storedLastName);
      } else{
        setLastName('');
      }
      if (storedAvatar) {
        setAvatar(storedAvatar);
      } else {
        setAvatar(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json');
      const menuItems = response.data.menu;
      console.log('Fetched menu items from server', menuItems);
      return menuItems;
    } catch (error) {
      console.error('Error fetching menu from server', error);
      return [];
    }
  };

  const initializeMenu = async () => {
    setLoading(true);
    try {
      const data = await fetchMenuFromDB();
      console.log('Data fetched from DB:', data);
      if (data.length === 0) {
        console.log('Fetching data from server...');
        const menuItems = await fetchData();
        console.log('Data fetched from server:', menuItems);
        await saveMenuToDB(menuItems);
        console.log('Data saved to DB');
        setMenuItems(menuItems);
      } else {
        setMenuItems(data);
      }
    } catch (error) {
      console.error('Error initializing menu:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      initializeMenu();
    });

    // Cleanup the event listener when the component unmounts
    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [])
  );

  useEffect(() => {
    const debouncedFilter = debounce(filterMenu, 500);
    debouncedFilter();
    return () => debouncedFilter.cancel();
  }, [selectedItems, searchTerm]);

  const filterMenu = () => {
    setLoading(true);
    filterMenuByCategoryAndSearchTerm(selectedItems, searchTerm, (filteredItems) => {
        setMenuItems(filteredItems);
        setLoading(false);
    });
};
  const categ = [
    { id: 'starters', title: 'Starters' },
    { id: 'mains', title: 'Mains' },
    { id: 'desserts', title: 'Desserts' },
    { id: 'drinks', title: 'Drinks' },
    { id: 'specials', title: 'Specials' },
  ];

  const toggleSelection = (id) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((item) => item !== id)
        : [...prevSelectedItems, id]
    );
  };

  const renderItem = useCallback(({ item }) => {
    const isSelected = selectedItems.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.menuButton, isSelected && styles.selectedMenuButton]}
        onPress={() => toggleSelection(item.id)}
      >
        <Text style={[styles.menuButtonText, isSelected && styles.selectedMenuButtonText]}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  }, [selectedItems]);

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItem}>
      <View style={styles.menuItemTextContainer}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemDescription}>{item.description}</Text>
        <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <Image
        source={{ uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true` }}
        style={styles.menuItemImage}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader firstName={firstName} lastName={lastName} avatar={avatar}/>
      <View style={styles.heroSection}>
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroHeader}>Little Lemon</Text>
          <Text style={styles.heroSubHeader}>Chicago</Text>
          <Text style={styles.heroAbout}>
            We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
          </Text>
        </View>
        <Image source={require('../assets/hero-image.png')} style={styles.heroImage} />
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#ccc"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>
      <View style={styles.menuBreakdown}>
        <Text style={styles.menuBreakdownTitle}>Order for Delivery!</Text>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={styles.menuButtonsContainer}
          data={categ}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
      <View style={styles.menuItemsContainer}>
        <Text style={styles.menuItemsHeader}>Menu</Text>
        <View style={styles.separatorBold} />
        {loading ? (
          <ActivityIndicator size="large" color="#495E57" />
        ) : (
          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => `${item.name}`}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: 'white',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    height: 120,
    marginTop: 10
  },
  logo: {
    width: 200,
    height: 50,
    marginLeft: 50
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
  heroSection: {
    backgroundColor: '#495E57',
    padding: 20,
    borderRadius: 10,
    height: 320, 
  },
  heroTextContainer: {
    flex: 1,
    marginRight: 20,
  },
  heroHeader: {
    color: '#F4CE14',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  heroSubHeader: {
    color: 'white',
    fontSize: 24,
    textAlign: 'left',
    marginVertical: 10,
  },
  heroAbout: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
    width: 175
  },
  heroImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    position: 'absolute',
    right: 20,
    top: 20,
    marginTop: 60
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 20,
    padding: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBreakdown: {
    padding: 20,
    marginTop: 5,
    borderRadius: 10,
  },
  menuBreakdownTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#495E57',
    marginBottom: 10,
  },
  menuButtonsContainer: {
    justifyContent: 'space-between',
  },
  menuButton: {
    backgroundColor: '#c1c8d2',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  menuButtonText: {
    color: '#495E57',
    fontWeight: 'bold',
  },
  selectedMenuButton: {
    backgroundColor: '#495E57',
  },
  selectedMenuButtonText: {
    color: '#FFF',
  },
  menuItemsContainer: {
    flex: 1,
    padding: 20,
  },
  menuItemsHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#495E57',
    marginBottom: 5,
  },
  separatorBold: {
    height: 2,
    backgroundColor: '#495E57',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  menuItemTextContainer: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495E57',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#6e6e6e',
    marginVertical: 5,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495E57',
  },
  menuItemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginLeft: 20,
  }
});
