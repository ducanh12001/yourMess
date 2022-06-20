import { useNavigation } from '@react-navigation/native'
import { child, get, onValue, ref, update } from 'firebase/database'
import React, { useEffect, useRef, useState } from 'react'
import { FlatList, Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native'
import { Appbar, Avatar } from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import { auth, db, storage } from '../../../src/config/firebase'
import { SendMessage, RecieveMessage } from '../components/Mess'
import { launchImageLibrary } from 'react-native-image-picker';
import * as storageItem from "firebase/storage";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import PushNotification from "react-native-push-notification";

const ChatScreen = ({ route }) => {
  const navigation = useNavigation();

  const { Username, pImage } = route.params;
  const [mess, setMess] = useState('');
  const [allMess, setAllMess] = useState([]);
  const { FriendId, friendStatus } = route.params;
  const [fromId, setFromId] = useState('');
  const scrollBot = useRef(null);

  const [emojiIcon, setEmojiIcon] = useState(true);
  const [closeIcon, setCloseIcon] = useState(false);
  const [inputClick, setInputClick] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    createChannel();
    const currentId = auth.currentUser.uid;
    setFromId(currentId);
    const dbRef = child(child(ref(db, 'chats'), currentId), FriendId + "/messages");
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

  const createChannel = () => {
    PushNotification.createChannel(
      {
        channelId: "channel-id",
        channelName: "My channel",
        channelDescription: "A channel to categorise your notifications",
        playSound: false, // (optional) default: true
        soundName: "default",
        vibrate: true,
      }
    );
  }

  const sendMess = () => {
    const currentId = auth.currentUser.uid;
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~a-zA-Z0-9]/;
    if (mess.trim()) {
      SendMessage(currentId, FriendId, mess, "").then((res) => {
        setMess('');
      }).catch(err => {
        alert(err);
      })

      RecieveMessage(currentId, FriendId, mess, "").then((res) => {
        setMess('');
        /*PushNotification.localNotification({
          channelId: "channel-id", 
          title: name,
          message: mess
        })*/
      }).catch(err => {
        alert(err);
      })
    }
    setMess('');
  }

  const openImage = async () => {
    launchImageLibrary('photo', async (response) => {
      if (response.didCancel) {
        console.log("cancel img");
      } else if (response.errorCode == 'permission') {
        console.log("permission denied");
      } else {
        const imgUri = response.assets[0].uri;

        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", imgUri, true);
          xhr.send(null);
        });

        const storageRef = storageItem.ref(storage, `images/from/${auth.currentUser.uid}`);
        const metadata = {
          contentType: 'image/jpeg',
        };
        await storageItem.uploadBytes(storageRef, blob, metadata)
          .then(async (snapshot) => {
            const downloadURL = await storageItem.getDownloadURL(storageRef);
            SendMessage(fromId, FriendId, "", downloadURL).then((res) => {
            }).catch(err => {
              alert(err);
            })

            RecieveMessage(fromId, FriendId, "", downloadURL).then((res) => {
            }).catch(err => {
              alert(err);
            })
            blob.close();
          })
      }
    });
  }

  const showEmoji = () => {
    setEmojiIcon(false);
    setCloseIcon(true);
    setInputClick(false);
    Keyboard.dismiss();
  }

  const closeEmoji = () => {
    setEmojiIcon(true);
    setCloseIcon(false);
    setInputClick(false);
  }

  const goDown = () => {
    scrollBot.current.scrollToOffset({ offset: 0, animated: true });
  }

  return (
    <View style={styles.container}>
      <Appbar style={styles.Appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Avatar.Image size={40} source={{ uri: pImage }} />
        {friendStatus === true ?
          <Appbar.Content title={Username} subtitle="Đang hoạt động" />
          :
          <Appbar.Content title={Username} subtitle="Offline" />
        }
        <Appbar.Action icon="arrow-down-circle" color="#2694de" size={28} onPress={goDown} />
        <Appbar.Action icon="phone" color="#2694de" size={28} onPress={() => navigation.navigate('CallComponent')} />
        <Appbar.Action icon="video" color="#2694de" size={28} />
      </Appbar>
      <View style={{ flex: 1 }}>
        <FlatList
          inverted
          data={allMess}
          keyExtractor={(item, index) => index}
          ref={scrollBot}
          renderItem={({ item }) => {
            return (
              <View style={[styles.view, fromId === item.fromId ? styles.viewRight : styles.viewLeft]}>
                {item.image === "" ?
                  <>
                    <Text style={[styles.text, { color: fromId === item.fromId ? 'white' : 'black' }]}>{item.message.trimStart().trimEnd()}</Text>
                    <Text style={styles.time}>{item.createTime}</Text></>
                  :
                  <View style={{ backgroundColor: "#ebebeb" }}>
                    <Image source={{ uri: item.image }} style={{ resizeMode: 'stretch', marginBottom: 5, borderRadius: 10, height: 150, width: 200 }}></Image>
                    <Text style={styles.time2}>{item.createTime}</Text>
                  </View>
                }
              </View>
            )
          }}
        />
        {showScroll ?
          <TouchableOpacity style={styles.scrollButton} onPress={goDown}>
            <Ionicons name="arrow-down-circle" size={40} color="#2694de" />
          </TouchableOpacity>
          :
          <></>
        }
      </View>
      <KeyboardAvoidingView style={{}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.MessContainer}>
            {closeIcon && !emojiIcon && !inputClick ?
              <TouchableOpacity onPress={closeEmoji} style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Ionicons name="close-circle" size={25} color="#2694de" />
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={showEmoji} style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Entypo name="emoji-happy" size={25} color="#2694de" />
              </TouchableOpacity>
            }
            <TouchableOpacity onPress={openImage} style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <Ionicons name="image" size={25} color="#2694de" />
            </TouchableOpacity>
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <Ionicons name="mic" size={25} color="#2694de" />
            </TouchableOpacity>
            <TextInput keyboardType={Platform.OS === 'android' ? 'email-address' : 'ascii-capable'} onFocus={() => setInputClick(true)} multiline autoCapitalize={'sentences'} autoCorrect={false} style={styles.MessInput} value={mess} placeholder="message" onChangeText={text => setMess(text)} />
            <TouchableOpacity onPress={sendMess} style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <Ionicons name="send" size={25} color="#2694de" />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      {closeIcon && !emojiIcon && !inputClick ?
        <View style={{ height: 250 }}>
          <EmojiSelector
            showSearchBar={false}
            category={Categories.symbols}
            onEmojiSelected={emoji => setMess(mess + emoji)}
          />
        </View>
        :
        <View></View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebebeb"
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
    borderRadius: 20,
    maxWidth: '75%',
    backgroundColor: '#82eb5a',
    marginRight: 'auto'
  },
  viewRight: {
    margin: 10,
    borderRadius: 20,
    maxWidth: '75%',
    backgroundColor: '#17a2e6',
    marginLeft: 'auto',
  },
  text: {
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    color: '#373b3b',
    fontSize: 18
  },
  time: {
    color: '#585b5d',
    marginHorizontal: 10,
    marginBottom: 10
  },
  time2: {
    color: '#585b5d',
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#c7c6c6',
    borderRadius: 10,
    width: '20%',
    padding: 2
  },
  scrollButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    left: 0,
    right: 0
  }
})

export default ChatScreen