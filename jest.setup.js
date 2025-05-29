import '@testing-library/jest-native/extend-expect';

// Mock Firebase
jest.mock('./src/firebase/config', () => ({
  auth: {
    currentUser: null,
  },
  db: {},
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useFocusEffect: jest.fn(),
}));

// Mock Expo modules
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {},
  },
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

// Mock Expo Vector Icons globally
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  MaterialIcons: 'MaterialIcons',
  FontAwesome: 'FontAwesome',
  AntDesign: 'AntDesign',
  Entypo: 'Entypo',
  EvilIcons: 'EvilIcons',
  Feather: 'Feather',
  Foundation: 'Foundation',
  MaterialCommunityIcons: 'MaterialCommunityIcons',
  Octicons: 'Octicons',
  SimpleLineIcons: 'SimpleLineIcons',
  Zocial: 'Zocial',
}));

// Mock NativeWind
jest.mock('nativewind', () => ({
  styled: (Component) => Component,
}));

// Mock images and assets - simple string mock
jest.mock('../assets/hero-image.png', () => 'hero-image.png');

// Silence console warnings in tests
const originalConsole = global.console;
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Restore console after tests
afterAll(() => {
  global.console = originalConsole;
});
