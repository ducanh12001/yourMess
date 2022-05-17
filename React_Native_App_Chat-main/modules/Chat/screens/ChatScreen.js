import { useNavigation } from '@react-navigation/native'
import { child, onValue, ref } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native'
import { Appbar, Avatar } from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { auth, db } from '../../../src/firebase/config'
import { SendMessage, RecieveMessage } from '../components/Mess'

const ChatScreen = ({ route }) => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const { Username, pImage } = route.params;
  const [mess, setMess] = useState('');
  const [allMess, setAllMess] = useState([]);
  const { FriendId } = route.params;
  const [fromId, setFromId] = useState('');

  useEffect(() => {
    const currentId = auth.currentUser.uid;
    setFromId(currentId);
    const dbRef = child(child(ref(db, 'chats'), currentId), FriendId);
    const chat = onValue(dbRef, (snapshot) => {
        const messList = [];
        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
            messList.push({
              fromId: childData.fromId,
              toId: childData.toId,
              message: childData.message,
              image: childData.image,
              createTime: childData.createTime,
            })
        });
        setAllMess(messList.reverse());
    });          
    return chat
}, []);

  const sendMess = async () => {
    const currentId = auth.currentUser.uid;
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~a-zA-Z0-9]/;
    if (mess && specialChars.test(mess)) {
      SendMessage(currentId, FriendId, mess, "").then((res) => {
        setMess('');
      }).catch(err => {
        alert(err);
      })

      RecieveMessage(currentId, FriendId, mess, "").then((res) => {
        setMess('');
      }).catch(err => {
        alert(err);
      })
    }
    setMess('')
    //console.log(currentId + " to " + FriendId)
  }

  return (
    <View style={styles.container}>
      <Appbar style={styles.Appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Avatar.Image size={40} source={{ uri: pImage }} />
        <Appbar.Content title={Username} />
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity underlayColor='white' style={{ margin: 5 }}>
            <Ionicons name="videocam" size={25} color="#2694de" />
          </TouchableOpacity>
          <TouchableOpacity underlayColor='white' style={{ margin: 5 }}>
            <Ionicons name="call" size={25} color="#2694de" />
          </TouchableOpacity>
        </View>
      </Appbar>
      <FlatList
        inverted
        data={allMess}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => {
          return (
            <View style={[styles.view, fromId === item.fromId ? styles.viewRight : styles.viewLeft]}>
              <Text style={[styles.text, { color: fromId === item.fromId ? 'white' : 'black' }]}>{item.message.trimStart().trimEnd()}</Text>
              <Text style={styles.time}>{item.createTime}</Text>
            </View>
          )
        }}
      />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.MessContainer}>
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <Ionicons name="add-circle" size={25} color="#2694de" />
            </TouchableOpacity>
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <Ionicons name="image" size={25} color="#2694de" />
            </TouchableOpacity>
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <Ionicons name="mic" size={25} color="#2694de" />
            </TouchableOpacity>
            <TextInput multiline autoCapitalize={'sentences'} autoCorrect={false} style={styles.MessInput} value={mess} placeholder="message" onChangeText={text => setMess(text)} />
            <TouchableOpacity onPress={sendMess} style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <Ionicons name="send" size={25} color="#2694de" />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  Appbar: {
    backgroundColor: 'white'
  },
  MessContainer: {
    backgroundColor: '#d1d4d6',
    flexDirection: 'row',
  },
  MessInput: {
    borderRadius: 20,
    backgroundColor: 'white',
    margin: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '70%',
    flex: 5,
    fontSize: 16
  },
  viewLeft: {
    margin: 10,
    padding: 10,
    borderRadius: 20,
    maxWidth: '75%',
    backgroundColor: '#82eb5a',
    marginRight: 'auto'
  },
  viewRight: {
    margin: 10,
    padding: 10,
    borderRadius: 20,
    maxWidth: '75%',
    backgroundColor: '#17a2e6',
    marginLeft: 'auto'
  },
  text: {
    color: '#373b3b',
    fontSize: 18,
    marginBottom: 5
  },
  time: {
    color: '#585b5d'
  }
})

export default ChatScreen