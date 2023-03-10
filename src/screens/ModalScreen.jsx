import {useNavigation} from '@react-navigation/core';
import {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TextInput} from 'react-native-gesture-handler';
import tw from 'twrnc';
import useAuth from '../hooks/useAuth';
import storage from '@react-native-firebase/storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    //using type 3 key
    '754911955733-12a8b7d85ko3nibjv9r2s0fle0c6o7rk.apps.googleusercontent.com',
});

export default function ModalScreen() {
  const {user} = useAuth();
  const navigation = useNavigation();

  const [image, setImage] = useState(null);
  const [job, setJob] = useState('');
  const [age, setAge] = useState('');
  const [number, setNumber] = useState('');

  const incompleteForm = !image || !job || !age || number.length !== 10;

  const updateUserProfile = async () => {
    async function save() {
      // console.log(user.displayName);
      const imageRef = await storage().ref(user.uid);
      await imageRef
        .putFile(image.uri, {contentType: 'image/jpg'})
        .catch(error => {
          throw error;
        });
      const url = await imageRef.getDownloadURL().catch(error => {
        throw error;
      });
      try {
        const id = user.uid;
        await firestore()
          .collection('Users')
          .doc(id)
          .set({
            id: user.uid,
            displayName: user.displayName,
            photoURL: url,
            job: job,
            age: age,
            number: number,
            timestamp: firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            navigation.navigate('Home');
          });
      } catch (err) {
        console.log(err);
      }
    }
    navigation.navigate('ShowSelectedImage', {image, job, age, save});
  };

  async function selectImage() {
    let options = {
      title: 'You can choose one image',
      mediaType: 'photo',
      quality: 1,
      maxWidth: 800,
      maxHeight: 800,
      selectionLimit: 1,
    };

    await launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
        // Alert.alert('You did not select any image');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setImage(response.assets[0]);
      }
    });
  }
  async function captureImage() {
    let options = {
      title: 'You can choose one image',
      mediaType: 'photo',
      quality: 1,
      maxWidth: 800,
      maxHeight: 800,
      saveToPhotos: true,
      selectionLimit: 1,
    };

    await launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
        // Alert.alert('You did not select any image');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setImage(response.assets[0]);
      }
    });
  }

  return (
    <View style={tw`flex-1 items-center pt-4 bg-white`}>
      <Image
        style={tw`h-10 w-full mb-5`}
        resizeMode="contain"
        source={require('../assets/tinder-full-logo.png')}
      />
      <Text style={tw`text-2xl text-gray-500 p-2 mt-2 font-bold`}>
        Welcome {user.displayName}
      </Text>

      <View style={tw`flex gap-10`}>
        <View>
          <Text style={tw`text-center text-lg text-red-400  font-bold`}>
            Step 1: The Profile Pic
          </Text>
          <View
            style={tw`flex flex-row justify-evenly gap-10 items-center mt-5`}>
            <TouchableOpacity onPress={() => captureImage()}>
              <Ionicons name="image-outline" size={50} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => selectImage()}>
              <Ionicons name="folder-open-outline" size={50} color="black" />
            </TouchableOpacity>
          </View>
          {/* <TextInput
          onChangeText={text => setImage(text)}
          style={tw`text-center text-xl pb-2`}
          placeholder="Enter a Profile Pic URL"
        /> */}
        </View>
        <View>
          <Text style={tw`text-center text-lg text-red-400  font-bold`}>
            Step 2: Job
          </Text>
          <TextInput
            onChangeText={text => setJob(text)}
            style={tw`text-center text-xl pb-2`}
            placeholder="Enter your occupation"
          />
        </View>
        <View>
          <Text style={tw`text-center text-lg text-red-400  font-bold`}>
            Step 3: Age
          </Text>
          <TextInput
            keyboardType="number-pad"
            onChangeText={text => setAge(text)}
            style={tw`text-center text-xl pb-2`}
            placeholder="Enter your age"
          />
        </View>
        <View>
          <Text style={tw`text-center text-lg text-red-400  font-bold`}>
            Step 4: Phone Number
          </Text>
          <TextInput
            keyboardType="number-pad"
            onChangeText={text => setNumber(text)}
            style={tw`text-center text-xl pb-2`}
            placeholder="Enter your phone number"
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={updateUserProfile}
        disabled={incompleteForm}
        style={[
          tw`absolute bottom-10 p-3 rounded-xl  bg-red-400`,
          incompleteForm ? tw`bg-gray-400` : tw`bg-red-400`,
        ]}>
        <Text style={tw` text-center self-center text-white text-xl w-40`}>
          Update Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
