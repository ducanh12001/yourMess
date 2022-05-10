import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native';
import Modal from 'react-native-modal/dist/modal';
import { Appbar, Avatar, Button, Switch } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons'
import {launchImageLibrary} from 'react-native-image-picker';
import { auth, db, storage } from '../../../src/firebase/config';
import { signOut } from "firebase/auth";
import { child, get, onValue, ref, update } from 'firebase/database';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const ProfileComponent = () => {
  const navigation = useNavigation();

  const { height } = useWindowDimensions();
  const [switchButton, setSwitchButton] = useState(true);
  const [notification, setNotification] = useState(true);
  const [visibleModal, setVisibleModal] = useState(false);

  const showModal = () => setVisibleModal(true);
  const hideModal = () => setVisibleModal(false);

  const toggleNotification = () => {
    setNotification(!notification)
  }
  const toggle = () => {
    setSwitchButton(!switchButton)
  }

  const SignOutUser = () => {
    signOut(auth).then(() => {
      console.log("Sign-out successful");
      //navigation.replace("Login");
    }).catch((error) => {
      console.log("Out Error: " + error);
    });
  }

  const [name, setName] = useState('');
  
  useEffect(() => {
    get(child(ref(db), `users/${auth.currentUser.uid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        //console.log(snapshot.val());
        setName(snapshot.val().username);
        setImgUri(snapshot.val().profile_picture);
        //updateProfileImg();
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  const [imgUri, setImgUri] = useState('');

  const updateProfileImg = async () => {
    launchImageLibrary('photo', (response) => {
      //setImgUri(response.assets[0].uri);
      //console.log(response.assets[0].uri)
      if (response.didCancel) {
        console.log("cancel img");
      } else if(response.errorCode == 'permission') {
        console.log("permission denied");
      } else {
        const img = response.assets[0].uri;
        update(ref(db, `users/${auth.currentUser.uid}`), {
          profile_picture: img
        });
      }
    })
  }
  
  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.Appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Profile" />
      </Appbar.Header>
      <ScrollView style={{height: '100%'}}>
        <Modal isVisible={visibleModal} style={styles.modal}>
          <View><Text>You want exit this app</Text></View>
          <View>
            <Button mode="contained" onPress={SignOutUser}>Ok</Button>
            <Button mode="contained" onPress={hideModal}>Cancel</Button>
          </View>
        </Modal>
        <View style={styles.avatar}>
          <Avatar.Image size={height * 0.15} source={{uri : imgUri === '' ? 'https://cdn-icons-png.flaticon.com/512/149/149071.png' : imgUri}} />
          <View><Text style={{ color: 'black', fontSize: 20 }}>{name}</Text></View>
        </View>
        <View style={styles.viewSet}>
          {
            switchButton ?
              <View style={styles.icon}>
                <Icon name="user-check" size={30} />
              </View> :
              <View style={styles.icon}>
                <Icon name="user-lock" size={30} />
              </View>
          }
          <View style={styles.textSet}>
            <Text>Set status</Text>
          </View>
          <View style={styles.icon}><Switch value={switchButton} onValueChange={toggle} /></View>
        </View>
        <View style={styles.viewSet}>
          <View style={styles.icon}>
            <Icon name="hammer" size={30} />
          </View>
          <View style={styles.textSet}>
            <Text>Change password</Text>
          </View>
          <View style={styles.icon}></View>
        </View>
        <View style={styles.viewSet}>
          {notification ?
            <View style={styles.icon}>
              <Ionicons name="notifications" size={30} />
            </View> :
            <View style={styles.icon}>
              <Ionicons name="notifications-off" size={30} />
            </View>
          }
          <View style={styles.textSet}>
            <Text>Set status</Text>
          </View>
          <View style={styles.icon}><Switch value={notification} onValueChange={toggleNotification} /></View>
        </View>
        <TouchableOpacity style={styles.viewSet} onPress={updateProfileImg}>
          <View style={styles.icon}>
            <Ionicons name="image" size={30} />
          </View>
          <View style={styles.textSet}>
            <Text>Change Image</Text>
          </View>
          <View style={styles.icon}></View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewSet} onPress={showModal}>
          <View style={styles.icon}>
            <Ionicons name="log-out" size={30} />
          </View>
          <View style={styles.textSet}>
            <Text>Log out</Text>
          </View>
          <View style={styles.icon}></View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20
  },
  Appbar: {
    backgroundColor: 'white'
  },
  viewSet: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 0.35
  },
  icon: {
    display: 'flex',
    flex: 1,
    margin: 15
  },
  textSet: {
    display: 'flex',
    flex: 5,
    margin: 20
  },
  modal: {
    backgroundColor: 'white',
    display: 'flex'
  }
})

export default ProfileComponent;