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
import ResetPassword from './modules/auth/components/ResetPassword';
import Group from './modules/Home/components/Group';
import OneSignal from 'react-native-onesignal';
import GroupChatScreen from './modules/Chat/screens/GroupChatScreen';
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }} >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="GroupChatScreen" component={GroupChatScreen} />
      <Stack.Screen name="CallComponent" component={CallComponent} />
      <Stack.Screen name="NewPass" component={NewPass} />
      <Stack.Screen name="Group" component={Group} />
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
  const navigation = useNavigation()
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    OneSignal.setNotificationOpenedHandler(notification => {
      //navigation.navigate('ChatScreen', {Username: notification.notification.title})
      //console.log(notification.notification.title)
    });
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
      if (user) {
        const uid = user.uid;
        setUser(user);
        const deviceState = await OneSignal.getDeviceState();
        update(ref(db, `users/${uid}`), {
          status: true,
          deviceId: deviceState.userId
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