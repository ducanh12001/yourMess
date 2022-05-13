import React, { useEffect, useState } from 'react';
import LoginScreen from './modules/auth/screens/LoginScreen';
import HomeScreen from './modules/Home/screens/HomeScreens';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from './modules/auth/screens/SingUpScreen';

import ChatScreen from './modules/Chat/screens/ChatScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './src/firebase/config';
import { ref, update } from 'firebase/database';

const Stack = createStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }} >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  )
}

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }} >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={SignUpScreen} />
    </Stack.Navigator>
  )
}

export const MainStackNavigator = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        update(ref(db, `users/${auth.currentUser.uid}`), {
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