import {StyleSheet, TouchableOpacity, Image, View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import tw from 'twrnc';
import firestore from '@react-native-firebase/firestore';

export default function ChatRow({matchDetails}) {
  const navigation = useNavigation();
  const {user} = useAuth();
  const [matchedUserInfo, setMatchedUserInfo] = useState(null);
  const [lastMessage, setLastMessage] = useState('');

  useEffect(() => {
    setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
  }, [matchDetails, user]);

  useEffect(() => {
    function onResult(QuerySnapshot) {
      setLastMessage(QuerySnapshot.docs[0]?.data()?.message);
    }

    function onError(error) {
      console.error(error);
    }

    const unsub = firestore()
      .collection('Matches')
      .doc(matchDetails.id)
      .collection('Messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(onResult, onError);
    return unsub;
  }, [matchDetails, user]);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Messages', {
          matchDetails,
        })
      }
      style={[
        tw`flex-row items-center py-3 px-5 bg-white mx-3 bg-white mx-3 my-1 rounded-lg`,
        styles.cardShadow,
        {overflow: 'hidden'},
      ]}>
      <Image
        style={tw`rounded-full h-16 w-16 mr-4`}
        source={{uri: matchedUserInfo?.photoURL}}
        resizeMode="center"
      />
      <View style={[tw``, {overflow: 'hidden'}]}>
        <Text style={tw`text-lg font-semibold`}>
          {matchedUserInfo?.displayName}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={tw`max-w-40`}>
          {lastMessage || 'Say HI'}
        </Text>
      </View>
    </TouchableOpacity>
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
    shadowRadius: 1.4,
    elevation: 2,
  },
});
