import {View, Text, SafeAreaView, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/core';
import tw from 'twrnc';

export default function MatchScreen() {
  const navigation = useNavigation();
  const {params} = useRoute();

  const {loggedInProfile, userSwiped} = params;

  return (
    <SafeAreaView
      style={tw`h-full bg-red-500 pt-20 px-5 opacity-80 justify-center`}>
      <Image
        source={require('../assets/its-a-match.png')}
        style={tw`h-22 w-full mb-5 `}
        resizeMode="cover"
      />
      <Text style={tw`text-center text-white text-sm`}>
        You and {userSwiped.displayName} have liked each other.
      </Text>
      <View style={tw`flex flex-row justify-evenly pt-10 px-5`}>
        <Image
          source={{uri: loggedInProfile.photoURL}}
          style={[tw`w-30 h-30 rounded-full`, {resizeMode: 'contain'}]}
        />
        <Image
          source={{uri: userSwiped.photoURL}}
          style={[tw`w-30 h-30 rounded-full`, {resizeMode: 'contain'}]}
        />
      </View>
      <TouchableOpacity
        style={tw`bg-white m-5 px-10 py-5 rounded-full mt-15`}
        onPress={() => {
          navigation.goBack();
          navigation.navigate('Chat');
        }}>
        <Text style={tw`text-center text-2xl`}>Send a Message</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
