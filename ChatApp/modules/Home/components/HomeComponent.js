import { useNavigation } from '@react-navigation/native';
import { child, get, onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, Modal, ActivityIndicator } from 'react-native';
import { Appbar, Avatar, Searchbar } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, db } from '../../../src/config/firebase';
import Spinner from 'react-native-loading-spinner-overlay';

const HomeComponent = () => {
    const navigation = useNavigation();

    const [search, setSearch] = useState('');
    const [allFriendChats, setAllFriendChats] = useState([]);
    const [userBack, setUserBack] = useState('');
    const [loading, setLoading] = useState(false);

    const searchUser = (val) => {
        setSearch(val);
        setAllFriendChats(userBack.filter((item) => item.username.toLowerCase().match(val.toLowerCase())));
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const uid = auth.currentUser.uid;
            const users = [];
            onValue(child(ref(db), 'chats/' + uid), (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    const childKey = childSnapshot.key;
                    const lastMess = childSnapshot.val().lastMessage;
                    const ts = childSnapshot.val().ts;
                    //const messTime = moment((parseFloat(ts) - 12224)).fromNow();
                    const createDate = childSnapshot.val().createDate;
                    var createTime = '';
                    const c1 = new Date(ts);
                    const c2 = new Date();
                    if (c1.getDate() === c2.getDate()) {
                        createTime = childSnapshot.val().createTime;
                    } else {
                        createTime = createDate
                    }
                    //Date.now() = timestamp
                    onValue(child(ref(db), 'users/' + childKey), (snapshot) => {
                        setLoading(true);
                        const childData = snapshot.val();
                        users.push({
                            username: childData.username,
                            uid: childData.uid,
                            profileImage: childData.profile_picture,
                            status: childData.status,
                            lastMessage: lastMess,
                            messTime: createTime,
                            ts: ts,
                            isRoom: false,
                        })
                    });
                })
            })
            
            onValue(child(ref(db), 'rooms/'), (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    //console.log(childSnapshot.val().members);
                    const lastMessage = childSnapshot.val().lastMessage;
                    const createTime = childSnapshot.val().createTime;
                    const ts = childSnapshot.val().time;
                    const members = childSnapshot.val().members;

                    for (let i = 0; i < members.length; i++) {
                        if (members[i].memId === uid) {
                            users.push({
                                username: childSnapshot.val().roomName,
                                uid: childSnapshot.val().roomId,
                                profileImage: childSnapshot.val().roomImage,
                                isRoom: true,
                                lastMessage: lastMessage,
                                messTime: createTime,
                                ts: ts,
                                members: members
                            })
                        }
                    }
                })
            })
            users.sort((a, b) => b.ts - a.ts);
            setAllFriendChats(users);
            setUserBack(users);
            console.log(users);
        });
        return unsubscribe;
    }, [navigation]);

    const goChat = async (item) => {
        if (!item.isRoom) {
            navigation.navigate('ChatScreen', { Username: item.username, pImage: item.profileImage, FriendId: item.uid, friendStatus: item.status })
        } else {
            navigation.navigate('GroupChatScreen', { RoomId: item.uid, GroupName: item.username, GroupImage: item.profileImage, Members: item.members })
        }
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.Appbar} mode='center-aligned'>
                <Avatar.Image size={40} source={require('../../../src/images/user.png')} />
                <Appbar.Content title="Tin nhắn" />
                <Appbar.Action icon="account-multiple-plus" color="#2694de" size={28} onPress={() => { navigation.navigate('Group') }} />
            </Appbar.Header>
            <Searchbar
                placeholder="Search user"
                style={{ borderRadius: 50, margin: 10, }}
                onChangeText={val => searchUser(val)}
                value={search}
            />
            <FlatList
                style={{ padding: 5 }}
                data={allFriendChats}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    return (
                        <>
                            {item.uid === undefined ?
                                <View></View>
                                :
                                <TouchableOpacity
                                    onPress={() => goChat(item)}
                                    style={{ flexDirection: 'row', borderBottomColor: 'gray', borderBottomWidth: 0.5, padding: 5 }}>
                                    <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                                        <Image style={{ width: 50, height: 50, borderRadius: 50 / 2 }} source={{ uri: item.profileImage }}></Image>
                                    </View>
                                    <View style={{ width: '70%', alignItems: 'flex-start', justifyContent: 'center', marginLeft: 10 }}>
                                        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>{item.username}</Text>
                                        <Text numberOfLines={1} style={{ color: 'black', fontSize: 16, }}>{item.lastMessage}</Text>
                                    </View>
                                    <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                        {!item.isRoom && item.status === false ? 
                                            <Ionicons name="radio-button-on" color='gray' size={18} />
                                            : !item.isRoom && item.status === true ? 
                                            <Ionicons name="radio-button-on" color='green' size={18} />
                                            : 
                                            <></>
                                        }
                                        <Text style={{ color: 'black', fontSize: 14 }}>{item.messTime}</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        </>
                    )
                }}
            />
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    Appbar: {
        backgroundColor: 'white',
    },
    status: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: 0,
        bottom: 0,
    },
    circle: {
        position: 'absolute',
        backgroundColor: '#abdbe3',
        margin: 10,
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        display: 'flex'
    }
})

export default HomeComponent