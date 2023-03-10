import {useNavigation} from '@react-navigation/core';
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useAuth from '../hooks/useAuth';
import tw from 'twrnc';

export default function LoginScreen() {
  const navigation = useNavigation();
  const {onGoogleButtonPress, user, loading} = useAuth();
  return (
    <SafeAreaView style={[tw`flex-1`]}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../assets/tinder.png')}
        style={[tw`flex-1`, {}]}
        resizeMode="cover">
        <View
          style={{
            position: 'absolute',
            bottom: 150,
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            disabled={loading && true}
            style={tw`bg-white p-4 rounded-2xl`}
            onPress={onGoogleButtonPress}>
            <Text style={tw`text-4 font-bold`}>Sign in & get swiping</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
