import {NavigationContainer} from '@react-navigation/native';
import {useEffect} from 'react';
import 'react-native-gesture-handler';

import SplashScreen from 'react-native-splash-screen'; //import SplashScreen

import {AuthProvider} from './src/hooks/useAuth';

import StackNavigator from './src/StackNavigator';

export default function App() {
  useEffect(() => {
    SplashScreen.hide(); //hides the splash screen on app load.
  }, []);

  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
