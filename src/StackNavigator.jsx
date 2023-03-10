import {createStackNavigator} from '@react-navigation/stack';
import useAuth from './hooks/useAuth';
import ChatScreen from './screens/ChatScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ModalScreen from './screens/ModalScreen';
import MatchScreen from './screens/MatchScreen';
import MessagesScreen from './screens/MessagesScreen';
import ShowSelectedImageScreen from './screens/ShowSelectedImageScreen';

const Stack = createStackNavigator();

export default function StackNavigator() {
  const {user} = useAuth();

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Group>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Messages"
              component={MessagesScreen}
              options={{headerShown: false}}
            />
          </Stack.Group>
          <Stack.Group screenOptions={{presentation: 'modal'}}>
            <Stack.Screen
              name="Modal"
              component={ModalScreen}
              options={{headerShown: false, gestureEnabled: true}}
            />
          </Stack.Group>
          <Stack.Group screenOptions={{presentation: 'modal'}}>
            <Stack.Screen
              name="ShowSelectedImage"
              component={ShowSelectedImageScreen}
              options={{headerShown: false, gestureEnabled: true}}
            />
          </Stack.Group>
          <Stack.Group screenOptions={{presentation: 'transparentModal'}}>
            <Stack.Screen
              name="Match"
              component={MatchScreen}
              options={{headerShown: false, gestureEnabled: true}}
            />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
      )}
    </Stack.Navigator>
  );
}
