import { View, Text, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const HeroSection = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <View className="bg-primary p-3 rounded-lg">
      <View className="flex-row justify-between">
        <View className="flex-1 mr-2">
          <Text className="text-secondary text-3xl font-bold">
            Little Lemon
          </Text>
          <Text className="text-white text-2xl mb-1">
            Chicago
          </Text>
          <Text className="text-white text-base">
            We are a family owned Mediterranean restaurant, focused on traditional 
            recipes served with a modern twist.
          </Text>
        </View>
        <Image 
          source={require('../../assets/hero-image.png')} 
          className="w-28 h-28 rounded-lg self-start mt-8"
        />
      </View>
      
      <View className="flex-row items-center bg-white rounded-lg mt-3 px-3 py-2">
        <Ionicons name="search" size={20} color="#6e6e6e" className="mr-1" />
        <TextInput
          className="flex-1 ml-1 text-base"
          placeholder="Search menu"
          placeholderTextColor="#9ca3af"
          value={searchTerm}
          onChangeText={onSearchChange}
        />
      </View>
    </View>
  );
};
