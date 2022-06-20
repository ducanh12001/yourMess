import React, { useEffect, useState } from 'react';
import LoginScreen from './modules/auth/screens/LoginScreen';
import HomeScreen from './modules/Home/screens/HomeScreens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from './modules/auth/screens/SingUpScreen';
import ChatScreen from './modules/Chat/screens/ChatScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './src/config/firebase';
import { ref, update } from 'firebase/database';
import CallComponent from './modules/Chat/components/CallComponent';
import NewPass from './modules/Home/components/NewPass';
import NewPassForm from './modules/auth/components/ResetPassword';
import ResetPassword from './modules/auth/components/ResetPassword';

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }} >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="CallComponent" component={CallComponent} />
      <Stack.Screen name="NewPass" component={NewPass} />
    </Stack.Navigator>
  )
}

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }} >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={SignUpScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  )
}

export const MainStackNavigator = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUser(user);
        update(ref(db, `users/${uid}`), {
          status: true
        }).then(() => {
          console.log("onl");
        }).catch((error) => {
          alert("onl" + error);
        })
      } else {
        setUser(null);
      }
    });
    return unsubscribe
  }, []);

  return (
    <>{user ? <AppStack /> : <AuthStack />}</>
  )
}