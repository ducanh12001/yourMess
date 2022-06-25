import React, { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View, KeyboardAvoidingView } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../../src/config/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from 'firebase/database';
import moment from 'moment';
import 'moment/locale/vi';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import OneSignal from 'react-native-onesignal';

const SignUpForm = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const { width } = useWindowDimensions();

  function writeUserData(userId, name, email, deviceId) {
    const time = moment();
    time.locale('vi');
    const createAt = time.format('LLLL');
    set(ref(db, 'users/' + userId), {
      uid: userId,
      username: name,
      email: email,
      profile_picture: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      status: true,
      createAt: createAt,
      idAdd: uuidv4().slice(0, 8),
      friendList: [],
      friendRequest: [],
      userRequest: [],
      deviceId: deviceId
    });
  }

  const signUpUser = async () => {
    if (email === '' || password === '') {
      alert("Vui lòng điền thông tin");
    } else {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            alert('Email đã được sử dụng');
          } else if (error.code === 'auth/invalid-email') {
            alert('Email không hợp lệ!');
          } else {
            alert(error)
          }
        }).then(async() => {
          const uid = auth.currentUser.uid;
          const deviceState = await OneSignal.getDeviceState();
          writeUserData(uid, name, email, deviceState.userId);
        }).catch(err => {
          console.log("Create err" + err);
        })
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={{ flex: 1, }}>
        <TextInput
          style={styles.viewInput}
          label="Email"
          mode="flat"
          value={email}
          theme={{ roundness: 0 }}
          placeholder="mời bạn nhập email"
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.viewInput}
          label="Password"
          mode="flat"
          value={password}
          secureTextEntry
          theme={{ roundness: 0 }}
          onChangeText={text => setPassword(text)}
        />
        <TextInput
          style={styles.viewInput}
          label="Nick name"
          mode="flat"
          value={name}
          theme={{ roundness: 0 }}
          onChangeText={text => setName(text)}
        />

        <Button mode="contained"
          icon="pencil"
          style={[styles.cusButton]}
          theme={{ roundness: 0 }}
          onPress={signUpUser}
        >Register
        </Button>
        <Text onPress={() => {
          navigation.navigate('Login')
        }} style={[styles.textOr, { marginLeft: width * 0.2, color: 'green' }]}>
          If you have account, to login
        </Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cusButton: {
    marginBottom: 15
  },
  viewInput: {
    marginBottom: 15
  },
  textOr: {
    justifyContent: "center",
    fontSize: 15,
  }
})

export default SignUpForm;