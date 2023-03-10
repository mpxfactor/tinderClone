import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useRoute} from '@react-navigation/core';
import tw from 'twrnc';
import useAuth from '../hooks/useAuth';

export default function ShowSelectedImageScreen() {
  const {params} = useRoute();
  const {image, job, age, save} = params;
  const {user} = useAuth();

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`relative bg-white h-3/4 rounded-xl  mx-6 mt-8`}>
        <Image
          source={{uri: image.uri}}
          style={tw`absolute top-0 h-full w-full rounded-xl`}
        />
        <View
          style={[
            tw`absolute bg-white w-full h-20 bottom-0 justify-between items-center flex-row px-6 py-2 rounded-b-xl `,
            ,
            styles.cardShadow,
          ]}>
          <View>
            <Text style={tw`text-xl font-bold`}>{user.displayName}</Text>
            <Text>{job}</Text>
          </View>
          <Text style={tw`text-2xl font-bold `}>{age}</Text>
        </View>
        <TouchableOpacity
          onPress={save}
          style={[
            tw`absolute -bottom-20  w-full p-3 rounded-xl  bg-red-400
            bg-red-400`,
          ]}>
          <Text style={tw`text-center self-center text-white text-xl w-40`}>
            Save Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
