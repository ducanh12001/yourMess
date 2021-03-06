import React, { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';
import { auth } from '../../../src/config/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginForm = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signInUser = async () => {
    if (email === '' || password === '') {
      alert("Vui lòng điền thông tin");
    } else {
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("Login");
        })
        .catch((error) => {
          if (error.code === "auth/user-not-found") {
            alert("Không tìm thấy người dùng");
          } else if (error.code === "auth/wrong-password") {
            alert("Sai mật khẩu");
          } else {
            alert(error);
          }
        });
    }
  }

  return (
    <View>
      <View style={styles.viewInput}>
        <TextInput
          label="Email"
          mode="flat"
          value={email}
          theme={{ roundness: 0 }}
          placeholder="mời bạn nhập email"
          onChangeText={text => setEmail(text)}
        />
      </View>
      <View style={styles.viewInput}>
        <TextInput
          label="Password"
          value={password}
          mode="flat"
          secureTextEntry
          onChangeText={text => setPassword(text)}
          theme={{ roundness: 0 }}
        />
      </View>
      <Button mode="contained"
        onPress={signInUser}
        style={[styles.cusButton]}
        theme={{ roundness: 0 }}
        icon="login"
      >Login
      </Button>
      <Button mode="contained"
        onPress={() => navigation.navigate("Register")}
        icon="pencil"
        style={[styles.cusButton]}
        theme={{ roundness: 0 }}
      >Register
      </Button>
      <Text onPress={() => {
        navigation.navigate('ResetPassword')
      }} style={styles.textOr}>
        Quên mật khẩu?
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  cusButton: {
    marginBottom: 15
  },
  viewInput: {
    marginBottom: 15
  },
  textOr: {
    justifyContent: "center",
    fontSize: 20,
    margin: 0
  },
  textOr: {
    alignSelf: 'center',
    fontSize: 15,
    color: 'red'
  },

})
export default LoginForm;