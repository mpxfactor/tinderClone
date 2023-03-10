import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../components/Header';
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import {useRoute} from '@react-navigation/core';
import tw from 'twrnc';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';
import firestore from '@react-native-firebase/firestore';

export default function MessagesScreen() {
  const {params} = useRoute();
  const {matchDetails} = params;
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState('');
  const {user} = useAuth();

  useEffect(() => {
    function onResult(QuerySnapshot) {
      setMessages(QuerySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
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

  const sendMessage = async () => {
    await firestore()
      .collection('Matches')
      .doc(matchDetails.id)
      .collection('Messages')
      .add({
        timestamp: firestore.FieldValue.serverTimestamp(),
        userId: user.uid,
        displayName: user.displayName,
        photoURL: matchDetails.users[user.uid].photoURL,
        message: input,
      });

    setInput('');
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <Header
        callEnabled
        title={getMatchedUserInfo(matchDetails?.users, user.uid).displayName}
        phNumber={getMatchedUserInfo(matchDetails?.users, user.uid).number}
      />
      {/* { console.log(getMatchedUserInfo(matchDetails?.users, user.uid))} */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={tw`flex-1`}
        keyboardVerticalOffset={10}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={[tw``]}>
          <View style={[tw`h-full`]}>
            <FlatList
              inverted={-1}
              data={messages}
              style={tw`p-4`}
              keyExtractor={item => item.id}
              renderItem={({item: message}) =>
                message.userId === user.uid ? (
                  <SenderMessage key={message.id} message={message} />
                ) : (
                  <ReceiverMessage key={message.id} message={message} />
                )
              }
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View
        style={tw`flex-row justify-between items-center border-t border-gray-200 px-4 py-2 bg-white max-w-full relative`}>
        <TextInput
          style={tw`h-12 text-xl min-w-full`}
          placeholder="Send Message"
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          value={input}
          placeholderTextColor="rgba(0,0,0,0.2)"
        />
        <View style={tw`absolute right-4`}>
          <Button onPress={sendMessage} title="Send" color="#FF5864" />
        </View>
      </View>
    </SafeAreaView>
  );
}
