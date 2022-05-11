import React, { useEffect, useState } from 'react';
import LoginScreen from './modules/auth/screens/LoginScreen';
import HomeScreen from './modules/Home/screens/HomeScreens';
import {createStackNavigator} from '@react-navigation/stack';
import SignUpScreen from './modules/auth/screens/SingUpScreen';

import ChatScreen from './modules/Chat/screens/ChatScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebase/config';

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
      <Stack.Screen name="Login" component ={LoginScreen} />
      <Stack.Screen name="Register" component ={SignUpScreen} />
    </Stack.Navigator> 
  )
}

export const MainStackNavigator = () =>{
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      user ? setUser(user) : setUser(null);
    });
    return unsubscribe
  }, []);

  return (
    <>{user ? <AppStack /> : <AuthStack />}</> 
  )
}