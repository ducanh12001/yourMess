import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { Appbar, Searchbar } from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { child, onValue, push, ref, serverTimestamp, set } from 'firebase/database';
import { auth, db } from '../../../src/config/firebase';
import { v4 as uuidv4 } from 'uuid';

const Group = () => {
  const navigation = useNavigation();

  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [userBack, setUserBack] = useState('');
  const [groupName, setGroupName] = useState('')
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState();
  const [members, setMembers] = useState();
  const [roomName, setRoomName] = useState('');
  const [memId, setMemId] = useState();
  const [memName, setMemName] = useState();
  const [memPic, setMemPic] = useState();

  const searchUser = (val) => {
    setSearch(val);
    setAllUsers(userBack.filter((item) => item.username.toLowerCase().match(val.toLowerCase())));
  }

  useEffect(() => {
    setLoading(true);
    const subcriber = onValue(child(ref(db), 'users'), (snapshot) => {
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        const users = [];
        snapshot.forEach((childSnapshot) => {
          const childData = childSnapshot.val();
          if (childData.uid === uid) {
            setMemId(childData.uid);
            setMemName(childData.username);
            setMemPic(childData.profile_picture)
          } else {
            users.push({
              username: childData.username,
              uid: childData.uid,
              profileImage: childData.profile_picture,
              checked: false,
            })
          }
        })
        setAllUsers(users);
        setUserBack(users);
      }
    });
    return subcriber
  }, []);

  const doCheck = (id) => {
    let arr = allUsers.filter((item, index) => {
      if (item.uid === id) {
        item.checked = !item.checked;
      }
      return { ...item }
    })
    setAllUsers(arr);
    let count = 0;
    let newMember = [{
      memId: memId,
      memName: memName,
      memPic: memPic
    }];
    let roomName = ''
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].checked) {
        count++;
        newMember.push({ memId: arr[i].uid, memName: arr[i].username, memPic: arr[i].profileImage });
        for (let j = 0; j < newMember.length; j++) {
          if (j == 0) {
            roomName = newMember[j].memName;
          } else {
            roomName += ', ' + newMember[j].memName
          }
        }
      }
    }
    setRoomName(roomName);
    setMembers(newMember);
    setCount(count);
  }

  const createRoom = async () => {
    const uid = auth.currentUser.uid;
    let finalRoomName = '';
    if (groupName.trim() !== '') {
      finalRoomName = groupName;
    } else {
      finalRoomName = roomName;
    }
    const roomId = uuidv4().slice(0, 6);
    await set(ref(db, 'rooms/' + roomId), {
      roomId: roomId,
      roomName: finalRoomName,
      hostId: uid,
      members: members,
      roomImage: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      ts: serverTimestamp(),
      lastMessage: "Nhóm được tạo bởi " + memName,
      time: serverTimestamp()
    }).then(()=> {
      navigation.navigate('GroupChatScreen', {RoomId :roomId, GroupName: finalRoomName, Members:members, GroupImage: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'})
    })
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Appbar.Header style={styles.Appbar}>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title="Tạo nhóm" />
            {count > 1 ?
              <Appbar.Action icon="checkbox-marked" disabled={false} color="#2694de" size={28} onPress={createRoom} />
              :
              <Appbar.Action icon="checkbox-marked" disabled={true} color="#2694de" size={28} />
            }
          </Appbar.Header>
          <TextInput
            value={groupName}
            placeholder='Tên nhóm'
            onChangeText={(text) => setGroupName(text)}
            style={styles.viewName}
          />
          <Searchbar
            style={styles.search}
            placeholder='Tìm bạn...'
            value={search}
            onChangeText={val => searchUser(val)}
          />
          <Text style={{ marginLeft: 10 }}>your friends</Text>
          <FlatList
            style={{ padding: 5 }}
            data={allUsers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <>
                  {item.uid === undefined ?
                    <View></View>
                    :
                    <TouchableOpacity onPress={() => doCheck(item.uid)} style={{ flexDirection: 'row', borderBottomColor: 'gray', borderBottomWidth: 0.5, padding: 5 }}>
                      <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                        <Image style={{ width: 40, height: 40, borderRadius: 40 / 2 }} source={{ uri: item.profileImage }}></Image>
                      </View>
                      <View style={{ width: '75%', alignItems: 'flex-start', justifyContent: 'center', marginLeft: 10 }}>
                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>{item.username}</Text>
                      </View>
                      <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                        {item.checked === false ?
                          <Ionicons name="ellipse-outline" color='gray' size={18} />
                          :
                          <Ionicons name="checkmark-circle" color='blue' size={18} />
                        }
                      </View>
                    </TouchableOpacity>
                  }
                </>
              )
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20
  },
  viewMember: {
    flexDirection: 'row',
    marginTop: 5,
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.3
  },
  viewName: {
    fontSize: 16,
    color: 'black',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginTop: 15,
    backgroundColor: 'white',
    borderWidth: 0.5,
  },
  viewMes: {
    paddingLeft: 10,
    color: 'black'
  },
  search: {
    borderRadius: 100,
    margin: 10,
  },
  Appbar: {
    backgroundColor: 'white'
  },
  circle: {
    position: 'absolute',
    margin: 10,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Group