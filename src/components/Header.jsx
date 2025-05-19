import { View, TouchableOpacity, Image, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getInitials } from '../utils/helpers';

/**
 * Universal Header component for Little Lemon app
 * 
 * @param {boolean} showBackButton - Show back button
 * @param {function} onBackPress - Custom back button handler
 * @param {string} firstName - User first name (for avatar)
 * @param {string} lastName - User last name (for avatar)
 * @param {string} avatar - Avatar image URI
 * @param {boolean} showAvatar - Show avatar profile button
 */
const Header = ({
  showBackButton = false,
  onBackPress,
  firstName = '',
  lastName = '',
  avatar = null,
  showAvatar = false,
  ...props
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View className="w-full bg-white" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 py-2 h-20">
        <View className="w-10 items-center">
          {showBackButton && (
            <TouchableOpacity
              onPress={handleBackPress}
              className="w-10 h-10 rounded-full items-center justify-center"
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#495E57" />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-1 items-center justify-center">
          <Image
            source={require('../../assets/logo.png')}
            className="w-48 h-12"
            resizeMode="contain"
          />
        </View>

        <View className="w-10 items-center">
          {showAvatar && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
              className="w-10 h-10 rounded-full overflow-hidden bg-lightGray"
              activeOpacity={0.7}
            >
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  className="w-full h-full"
                />
              ) : (
                <View className="w-full h-full bg-primary items-center justify-center">
                  <Text className="text-white text-sm font-bold">
                    {getInitials(firstName, lastName)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View className="h-px w-full bg-headerBg" />
    </View>
  );
};

export default Header;
