import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import useAuth from '../hooks/useAuth';
import firestore from '@react-native-firebase/firestore';
import {FlatList} from 'react-native-gesture-handler';
import ChatRow from './ChatRow';

export default function ChatList() {
  const {user} = useAuth();
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    function onResult(QuerySnapshot) {
      setMatches(QuerySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
    }

    function onError(error) {
      //   console.error(error);
    }

    firestore()
      .collection('Matches')
      .where('usersMatched', 'array-contains', user.uid)
      .onSnapshot(onResult, onError);
  }, [user]);

  return matches.length > 0 ? (
    <FlatList
      style={tw`h-full`}
      data={matches}
      keyExtractor={items => items.id}
      renderItem={({item}) => <ChatRow matchDetails={item} />}
    />
  ) : (
    <View style={tw`p-5`}>
      <Text>No matches at the moment.</Text>
    </View>
  );
}
