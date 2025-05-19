import { StatusBar } from 'expo-status-bar';
import "./global.css";
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator />
    </>
  );
}
