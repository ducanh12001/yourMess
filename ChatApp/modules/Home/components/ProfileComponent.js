import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native';
import Modal from 'react-native-modal/dist/modal';
import { Appbar, Avatar, Button, Switch } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { auth, db, storage } from '../../../src/firebase/config';
import { signOut } from "firebase/auth";
import { child, get, ref, update } from 'firebase/database';
import * as storageItem from "firebase/storage";
import Clipboard from '@react-native-community/clipboard';

const ProfileComponent = () => {
  const navigation = useNavigation();

  const { height } = useWindowDimensions();
  const [switchButton, setSwitchButton] = useState(true);
  const [notification, setNotification] = useState(true);
  const [visibleModal, setVisibleModal] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [addId, setAddId] = useState('');

  const showModal = () => setVisibleModal(true);
  const hideModal = () => setVisibleModal(false);

  const toggleNotification = () => {
    setNotification(!notification)
  }
  const toggle = () => {
    setSwitchButton(!switchButton)
  }

  const SignOutUser = async () => {
    const currentUser = auth.currentUser.uid;
    await signOut(auth).then(() => {
      update(ref(db, `users/${currentUser}`), {
        status: false,
      }).then(() => {
        console.log("off");
      }).catch((error) => {
        alert("off" + error);
      })
    }).catch((error) => {
      console.log("Out Error: " + error);
    });
  }

  useEffect(() => {
    get(child(ref(db), `users/${auth.currentUser.uid}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setName(snapshot.val().username);
        setImage(snapshot.val().profile_picture);
        setAddId(snapshot.val().idAdd)
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  const updateProfileImg = async () => {
    launchImageLibrary('mix', async (response) => {
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

        const storageRef = storageItem.ref(storage, `images/${auth.currentUser.uid}`);
        const metadata = {
          contentType: 'image/jpeg',
        };
        await storageItem.uploadBytes(storageRef, blob, metadata)
          .then(async (snapshot) => {
            const downloadURL = await storageItem.getDownloadURL(storageRef);
            await update(ref(db, `users/${auth.currentUser.uid}`), {
              profile_picture: downloadURL
            }).then(() => {
              setImage(downloadURL);
            })
            blob.close();
          })
      }
    });
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.Appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Profile" />
      </Appbar.Header>
      <ScrollView style={{ height: '100%' }}>
        <Modal isVisible={visibleModal} style={styles.modal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={{ fontSize: 18, marginTop: 20 }}>You want exit this app</Text>
            </View>
            <View style={styles.modalBody}>
              <Button style={{ margin: 5, width: '40%' }} mode="contained" onPress={SignOutUser}>Ok</Button>
              <Button style={{ margin: 5, width: '40%' }} mode="contained" onPress={hideModal}>Cancel</Button>
            </View>
          </View>
        </Modal>
        <View style={styles.avatar}>
          <Avatar.Image size={height * 0.15} source={{ uri: image === "" ? 'https://cdn-icons-png.flaticon.com/512/149/149071.png' : image }} />
          <View><Text style={{ color: 'black', fontSize: 20 }}>{name}</Text></View>
        </View>
        <View style={styles.viewSet}>
          <View style={styles.icon}>
            <Icon name="key" size={30} />
          </View>
          <View style={styles.textSet}>
            <Text selectable style={{fontSize: 18}}>{addId}</Text>
          </View>
            <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', flex: 2}} onPress={() => Clipboard.setString(addId)}>
              <Text style={{ color: 'black', borderWidth: 1, padding: 6, fontWeight: 'bold'}}>Copy</Text>
            </TouchableOpacity>
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
            <Text>Set notification</Text>
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
    height: '100%',
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
    borderBottomWidth: 0.35,
  },
  icon: {
    display: 'flex',
    flex: 1,
    marginHorizontal: 15,
    alignItems: 'center', 
    justifyContent: 'center'
  },
  textSet: {
    display: 'flex',
    flex: 6,
    margin: 20,
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
  },
  modalHeader: {
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    justifyContent: "center",
    paddingHorizontal: 15,
    minHeight: 150,
    alignItems: "center",
  }
})

export default ProfileComponent;