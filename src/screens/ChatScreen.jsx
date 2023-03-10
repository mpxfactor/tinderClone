import {View, Text, Button, SafeAreaView} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/core';
import Header from '../components/Header';
import ChatList from '../components/ChatList';

export default function ChatScreen() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      <Header title="Chat" />
      <ChatList />
    </SafeAreaView>
  );
}
