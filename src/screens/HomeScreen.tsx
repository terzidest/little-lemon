import React, { useCallback, useEffect } from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import Screen from '../components/layout/Screen';
import { HeroSection } from '../components/HeroSection';
import { CategoryFilter } from '../components/CategoryFilter';
import { MenuItemCard } from '../components/MenuItemCard';
import useMenu from '../hooks/useMenu';
import { useStore } from '../store/useStore';
import type { MenuItem } from '../types';

const HomeScreen = () => {
  const userProfile = useStore((state) => state.userProfile);
  const {
    menuItems,
    loading,
    selectedCategories,
    searchTerm,
    loadMenu,
    toggleCategory,
    setSearchTerm,
  } = useMenu();

  useEffect(() => {
    loadMenu();
  }, []);

  const keyExtractor = useCallback((item: MenuItem) => `menu-item-${item.id}`, []);

  const renderItem = useCallback(
    ({ item }: { item: MenuItem }) => <MenuItemCard item={item} />,
    []
  );

  const listEmpty = (
    <View className="flex-1 justify-center items-center py-10">
      {loading ? (
        <ActivityIndicator size="large" color="#495E57" />
      ) : (
        <Text className="text-darkGray text-base">No menu items found.</Text>
      )}
    </View>
  );

  return (
    <Screen
      showHeader
      showBackButton={false}
      headerProps={{
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        avatar: userProfile.avatar,
        showAvatar: true,
      }}
      padding={false}
      scroll={false}
    >
      <View className="px-2 pt-2">
        <HeroSection searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <CategoryFilter selectedCategories={selectedCategories} onToggleCategory={toggleCategory} />
        <View className="flex-row justify-between items-center mb-2 mt-4">
          <Text className="text-xl font-bold text-primary">Menu</Text>
        </View>
        <View className="h-0.5 bg-primary mb-4" />
      </View>
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={listEmpty}
        ItemSeparatorComponent={() => <View className="h-px bg-gray-200 my-2" />}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 8, paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      />
    </Screen>
  );
};

export default HomeScreen;
