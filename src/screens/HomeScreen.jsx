import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Swiper from 'react-native-deck-swiper';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaView} from 'react-native-safe-area-context';
import generateId from '../lib/generateId';

export default function HomeScreen() {
  const navigation = useNavigation();
  const {user, logout} = useAuth();
  const [profiles, setProfiles] = useState([]);
  const swipeRef = useRef();

  useLayoutEffect(() => {
    const getUserData = async () => {
      await firestore()
        .collection('Users')
        .doc(user.uid)
        .get()
        .then(documentSnapshot => {
          if (!documentSnapshot.exists) navigation.navigate('Modal');
        });
    };
    getUserData();
  }, []);

  useEffect(() => {
    let unsubscribe;
    let passes = [];
    let swipes = [];

    const fetchCards = async () => {
      passes = await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('passes')
        .get()
        .then(snapshot => snapshot && snapshot.docs.map(doc => doc.id));
      swipes = await firestore()
        .collection('Users')
        .doc(user.uid)
        .collection('swipes')
        .get()
        .then(snapshot => snapshot && snapshot.docs.map(doc => doc.id));

      const passedUserIds = passes.length > 0 ? passes : ['test'];
      const swipedUserIds = swipes.length > 0 ? swipes : ['test'];
      unsubscribe =
        passedUserIds &&
        (await firestore()
          .collection('Users')
          .where('id', 'not-in', [...passedUserIds, ...swipedUserIds])
          .get()
          .then(querySnapshot => {
            // console.log(
            //   querySnapshot.docs
            //     .filter(
            //       doc =>
            //         doc.id !== user.uid &&
            //         doc.id !== 'swipes' &&
            //         doc.id !== 'passes',
            //     )
            //     .map(doc => ({
            //       id: doc.id,
            //     })),
            // );
            setProfiles(
              querySnapshot.docs
                .filter(
                  doc =>
                    doc.id !== user.uid &&
                    doc.id !== 'swipes' &&
                    doc.id !== 'passes',
                )
                .map(doc => ({
                  id: doc.id,
                  ...doc.data(),
                })),
            );
          }));
    };

    fetchCards();
  }, []);

  const swipeLeft = async cardIndex => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    await firestore()
      .collection('Users')
      .doc(user.uid)
      .collection('passes')
      .doc(userSwiped.id)
      .set({id: userSwiped.id});
  };
  const swipeRight = async cardIndex => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    let loggedInProfile;
    await firestore()
      .collection('Users')
      .doc(user.uid)
      .get()
      .then(snapshot => (loggedInProfile = snapshot.data()));

    // console.log(userSwiped, '\n', '\n', loggedInProfile);

    //check if the user swiped on you
    await firestore()
      .collection('Users')
      .doc(userSwiped.id)
      .collection('swipes')
      .doc(user.uid)
      .get()
      .then(async snapshot => {
        if (snapshot.exists) {
          //user has matched with you
          await firestore()
            .collection('Users')
            .doc(user.uid)
            .collection('swipes')
            .doc(userSwiped.id)
            .set({id: userSwiped.id});

          //create a match
          let matchId = generateId(user.uid, userSwiped.id);

          await firestore()
            .collection('Matches')
            .doc(matchId)
            .set({
              users: {[user.uid]: loggedInProfile, [userSwiped.id]: userSwiped},
              usersMatched: [user.uid, userSwiped.id],
              timestamp: firestore.FieldValue.serverTimestamp(),
            });
          navigation.navigate('Match', {
            loggedInProfile,
            userSwiped,
          });
        } else {
          await firestore()
            .collection('Users')
            .doc(user.uid)
            .collection('swipes')
            .doc(userSwiped.id)
            .set({id: userSwiped.id});
        }
      });
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      {/* Header */}
      <View style={tw`p-2 gap-4 flex-row  justify-between`}>
        <TouchableOpacity
          onPress={logout}
          style={tw` justify-center px-4 py-2`}>
          {user && (
            <Image
              source={{uri: user.photoURL}}
              style={tw`h-12 w-12 rounded-full`}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Modal')}
          style={tw` justify-center px-4 py-2`}>
          <Image
            source={require('../assets/tinder-icon.webp')}
            style={tw`h-16 w-16 rounded-full  `}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Chat')}
          style={tw` justify-center px-4 py-2`}>
          <Ionicons name="md-chatbubbles" size={32} color="#ff5864" />
        </TouchableOpacity>
      </View>
      {/* Header */}

      {/* Cards */}
      <View style={tw`flex-1 -mt-10`}>
        <Swiper
          ref={swipeRef}
          onSwipedLeft={cardIndex => swipeLeft(cardIndex)}
          onSwipedRight={cardIndex => swipeRight(cardIndex)}
          overlayLabels={{left: 'left'}}
          stackSize={6}
          cardIndex={0}
          verticalSwipe={false}
          animateCardOpacity
          containerStyle={{backgroundColor: 'transparent'}}
          cards={profiles}
          renderCard={card =>
            card ? (
              <View style={tw`relative bg-white h-3/4 rounded-xl`}>
                <Image
                  source={{uri: card.photoURL}}
                  style={tw`absolute top-0 h-full w-full rounded-xl`}
                />
                <View
                  style={[
                    tw`absolute bg-white w-full h-20 bottom-0 justify-between items-center flex-row px-6 py-2 rounded-b-xl `,
                    ,
                    styles.cardShadow,
                  ]}>
                  <View>
                    <Text style={tw`text-xl font-bold`}>
                      {card.displayName}
                    </Text>
                    <Text>{card.job}</Text>
                  </View>
                  <Text style={tw`text-2xl font-bold `}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  tw`relative bg-white h-3/4 rounded-xl justify-center `,
                  styles.cardShadow,
                ]}>
                <Text
                  style={tw`text-lg tracking-wide text-black font-semibold text-center mb-5`}>
                  No more matches
                </Text>
                <Image
                  source={require('../assets/cry-tears-face.jpg')}
                  style={tw`h-full w-full rounded-xl h-20 `}
                  resizeMode="contain"
                />
              </View>
            )
          }
        />
      </View>

      <View style={tw`flex flex-row justify-evenly mb-12`}>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeLeft()}
          style={tw`items-center justify-center rounded-full w-16 h-16 bg-red-200`}>
          <Entypo name="cross" size={42} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => swipeRef.current.swipeRight()}
          style={tw`items-center justify-center rounded-full w-16 h-16 bg-green-200`}>
          <Entypo name="heart" size={42} color="green" />
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
