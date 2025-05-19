import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CATEGORIES } from '../utils/helpers';
import { cn } from '../utils/style';

export const CategoryFilter = ({
  selectedCategories = [],
  onToggleCategory,
}) => {
  // Always use the predefined CATEGORIES
  const availableCategories = CATEGORIES;
  
  // Single category can be selected, so we use the first one if any
  const selectedCategory = selectedCategories.length > 0 ? selectedCategories[0] : null;
  
  return (
    <View className="my-4">
      <Text className="text-lg font-bold text-primary mb-2">
        ORDER FOR DELIVERY!
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="py-2"
      >
        {availableCategories.map((category) => {
          const isSelected = selectedCategory === category.id;
          
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => onToggleCategory(category.id)}
              className={cn(
                'mr-2 py-2 px-4 rounded-md',
                isSelected ? 'bg-primary' : 'bg-lightGray'
              )}
              testID={`category-${category.id}`}
            >
              <Text
                className={cn(
                  'font-medium',
                  isSelected ? 'text-white' : 'text-primary'
                )}
              >
                {category.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
