import React, { useState } from 'react';
import { Alert, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../src/firebase/config';
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUpForm = () =>{

    const navigation = useNavigation();

    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const {width} = useWindowDimensions();

    const signUpUser=() => {
      if (email === '' || password === '') {
        alert("Please enter details");
      }
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          user.updateProfile({
            displayName: name
          })
          setIsSignUp(true);
          console.log("ok");
          //navigation.navigate("Login");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (error.code === 'auth/email-already-in-use') {
            alert('That email address is already in use!');
          } else if (error.code === 'auth/invalid-email' && email != '') {
            alert('That email address is invalid!');
          }
        });
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
              mode="flat"
              value={password}
              secureTextEntry
              theme={{ roundness: 0 }}
              onChangeText={text => setPassword(text)}
          />
        </View>
        <View style={styles.viewInput}>
          <TextInput
              label="Nick name"
              mode="flat"
              value={name}
              theme={{ roundness: 0 }}
              onChangeText={text => setName(text)}
          />
        </View>

        <Button mode="contained" 
                icon="pencil"
                style={[styles.cusButton]}
                theme={{ roundness: 0 }}
                onPress = {signUpUser}
        >Register
        </Button>
        <Text onPress={() =>{
            navigation.navigate('Login')
        }} style={[styles.textOr,{marginLeft : width*0.2, color:'green'}]}>
            If you have account, to login
        </Text>
      </View>
    )
}

const styles = StyleSheet.create({
    cusButton :{
        marginBottom : 15
      },
      viewInput : {
        marginBottom : 15
      },
      textOr : {
        justifyContent : "center",
        fontSize : 15,
    }
})

export default SignUpForm;