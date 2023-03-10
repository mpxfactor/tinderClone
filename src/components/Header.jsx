import {View, Text, TouchableOpacity, Linking} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/core';

export default function Header({title, callEnabled, phNumber}) {
  const navigation = useNavigation();
  return (
    <View style={tw`p-2 flex flex-row items-center justify-between mt-2`}>
      <View style={tw`flex flex-row items-center justify-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={34} color="#FF5864" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold`}>{title}</Text>
      </View>
      {callEnabled && (
        <TouchableOpacity
          style={tw`rounded-full mr-4 p-3 px-4 bg-red-300`}
          onPress={() => {
            Linking.openURL(`tel:${phNumber}`);
          }}>
          <Foundation name="telephone" size={20} color="red" />
        </TouchableOpacity>
      )}
    </View>
  );
}
