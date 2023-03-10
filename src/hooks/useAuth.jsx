import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

GoogleSignin.configure({
  webClientId:
    //using type 3 key
    '754911955733-12a8b7d85ko3nibjv9r2s0fle0c6o7rk.apps.googleusercontent.com',
});

const AuthContext = createContext({});

//provider component
export function AuthProvider({children}) {
  // Set an initializing state whilst Firebase connects
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (loadingInitial) setLoadingInitial(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  async function onGoogleButtonPress() {
    setLoading(true);

    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    setLoading(false);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  async function logout() {
    setLoading(true);
    await GoogleSignin.revokeAccess();
    await auth()
      .signOut()
      .catch(error => setError(error))
      .finally(setLoading(false));
  }

  const memoedValue = useMemo(() => {
    user, onGoogleButtonPress, loadingInitial, loading, error, logout;
  }, [user, loading, error]);

  return (
    <AuthContext.Provider
      value={{
        user,
        onGoogleButtonPress,
        loadingInitial,
        loading,
        error,
        logout,
      }}>
      {/* !loadingInitial is added to solve loading delay problem */}
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
}

//getting context data
export default function useAuth() {
  return useContext(AuthContext);
}
