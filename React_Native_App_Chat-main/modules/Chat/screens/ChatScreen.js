import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native'
import { Appbar, Avatar } from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { auth } from '../../../src/firebase/config'
import {SendMessage, RecieveMessage } from '../components/Mess'

const ChatScreen = ({ route }) => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const { Username, pImage } = route.params;
  const [mess, setMess] = useState('');
  const {FriendId} = route.params;

  const sendMess = async () => {
    const currentId = auth.currentUser.uid;
    if (mess) {
      SendMessage(currentId, FriendId, mess).then((res) => {
        setMess('');
        Keyboard.dismiss();
      }).catch(err => {
        alert(err);
      })

      RecieveMessage(currentId, FriendId, mess).then((res) => {
        setMess('');
      }).catch(err => {
        alert(err);
      })
    }
    console.log(currentId + " to " + FriendId)
  }

  return (
    <View style={styles.container}>
      <Appbar style={styles.Appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Avatar.Image size={40} source={{ uri: pImage }} />
        <Appbar.Content title={Username} />
        <View style={{flexDirection:'row'}}>
        <TouchableOpacity underlayColor='white' style={{margin:5}}>
          <Ionicons name="videocam" size={25} color="#2694de" />
        </TouchableOpacity>
        <TouchableOpacity underlayColor='white' style={{margin:5}}>
          <Ionicons name="call" size={25} color="#2694de" />
        </TouchableOpacity>
        </View>
      </Appbar>
      <ScrollView>
        
      </ScrollView>
      <KeyboardAvoidingView >
        <TouchableWithoutFeedback>
          <View style={styles.MessContainer}>
            <TouchableOpacity underlayColor='white' style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Ionicons name="add-circle" size={25} color="#2694de"/>
            </TouchableOpacity>
            <TextInput style={styles.MessInput} value={mess} placeholder="message" onChangeText={text => setMess(text)}/>
            <TouchableOpacity onPress={sendMess} underlayColor='white' style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Ionicons name="send" size={25} color="#2694de"/>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flex: 1
  },
  Appbar: {
    backgroundColor: 'white'
  },
  MessContainer: {
    backgroundColor: '#d1d4d6',
    bottom: 0, 
    position: 'absolute', 
    width:'100%',
    flexDirection: 'row',
    padding: 3
  },
  MessInput: {
    borderRadius: 20, 
    padding: 5, 
    backgroundColor: 'white', 
    margin: 5,
    width: '70%',
    flex: 8
  }
})

export default ChatScreen