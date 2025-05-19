import React, { useCallback } from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Screen from '../components/layout/Screen';
import { HeroSection } from '../components/HeroSection';
import { CategoryFilter } from '../components/CategoryFilter';
import { MenuItemCard } from '../components/MenuItemCard';
import useMenu from '../hooks/useMenu';
import { useStore } from '../store/useStore';

const HomeScreen = () => {
  const { userProfile, loadUserProfile } = useStore();
  const { 
    menuItems, 
    loading, 
    selectedCategories, 
    searchTerm,
    loadMenu, 
    toggleCategory, 
    setSearchTerm 
  } = useMenu();
  
  // Load data on focus
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          // Load user profile and menu data
          await Promise.all([
            loadUserProfile(),
            loadMenu()
          ]);
        } catch (error) {
          console.error('Error loading data:', error);
        }
      };
      
      loadData();
    }, [])
  );
  
  // Safe key extractor that handles potentially undefined or null ids
  const keyExtractor = useCallback((item) => {
    return `menu-item-${item.id || Math.random().toString(36).substring(2, 9)}`;
  }, []);

  // Memoize the list header to prevent unnecessary re-renders
  const ListHeader = useCallback(() => (
    <View className="px-2 pt-2 pb-4">
      <HeroSection 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <CategoryFilter
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
      />
      
      <View className="flex-row justify-between items-center mb-2 mt-4">
        <Text className="text-xl font-bold text-primary">Menu</Text>
      </View>
      
      <View className="h-0.5 bg-primary mb-4" />
    </View>
  ), [searchTerm, selectedCategories, toggleCategory]);

  // Memoize the empty component
  const EmptyComponent = useCallback(() => (
    <View className="flex-1 justify-center items-center py-10">
      {loading ? (
        <ActivityIndicator size="large" color="#495E57" />
      ) : (
        <Text className="text-darkGray text-base">
          No menu items found.
        </Text>
      )}
    </View>
  ), [loading]);

  // Memoize the item separator
  const ItemSeparator = useCallback(() => (
    <View className="h-px bg-gray-200 my-2" />
  ), []);

  // Memoize the render item function
  const renderItem = useCallback(({ item }) => (
    <MenuItemCard item={item} />
  ), []);

  return (
    <Screen
      showHeader
      showBackButton={false}
      headerProps={{
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        avatar: userProfile.avatar,
        showAvatar: true
      }}
      padding={false}
      scroll={false}
    >
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyComponent}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={{ 
          flexGrow: 1,
          paddingHorizontal: 8, // Reduced from 16
          paddingBottom: 20
        }}
      />
    </Screen>
  );
};

export default HomeScreen;
