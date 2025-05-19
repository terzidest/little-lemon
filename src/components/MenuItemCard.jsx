import { useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { MENU_IMAGE_BASE_URL } from '../utils/helpers';

export const MenuItemCard = ({ item }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Process the image URL
  const processImageUrl = () => {
    if (!item.image) return null;
    
    // If it's already a full URL, use it directly
    if (item.image.startsWith('http')) {
      return item.image;
    }
    
    // Otherwise, append it to the base URL
    return `${MENU_IMAGE_BASE_URL}${item.image}`;
  };
  
  const imageUrl = processImageUrl();
  
  const handleImageLoad = () => {
    setImageLoading(false);
  };
  
  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };
  
  return (
    <View className="flex-row justify-between items-center mb-3 border-b border-gray-200 pb-3">
      <View className="flex-1 mr-4">
        <Text className="text-lg font-bold text-primary mb-1">
          {item.name || 'Unnamed Item'}
        </Text>
        <Text className="text-sm text-darkGray mb-2 flex-shrink" numberOfLines={2}>
          {item.description || 'No description available'}
        </Text>
        <Text className="text-base font-bold text-primary">
          ${parseFloat(item.price || 0).toFixed(2)}
        </Text>
        
        {/* Add category badge */}
        {item.category && (
          <View className="mt-1 bg-gray-100 self-start rounded-full px-2 py-1">
            <Text className="text-xs text-gray-700 capitalize">{item.category}</Text>
          </View>
        )}
      </View>
      
      <View className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200">
        {imageUrl && !imageError ? (
          <>
            <Image
              source={{ uri: imageUrl }}
              className="w-24 h-24"
              resizeMode="cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {imageLoading && (
              <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
                <ActivityIndicator size="small" color="#495E57" />
              </View>
            )}
          </>
        ) : (
          <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
            <Text className="text-gray-500 text-xs text-center">No Image</Text>
          </View>
        )}
      </View>
    </View>
  );
};
