import { useNavigation } from '@react-navigation/native';
import { child, onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import { Appbar, Avatar, Searchbar } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, db } from '../../../src/config/firebase';
import moment from 'moment';
import 'moment/locale/vi'
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
        setLoading(true);
        const time = moment();
        time.locale('vi');
        const createTime = time.format('LLLL');
        const createDate = time.format('L');
        const uid = auth.currentUser.uid;
        const subcriber = onValue(child(ref(db), 'chats/' + uid), (snapshot) => {
            const users = [];
            snapshot.forEach((childSnapshot) => {
                //const childData = childSnapshot.val();
                const childKey = childSnapshot.key;
                const lastMess = childSnapshot.val().lastMessage;
                const messTime = childSnapshot.val().createTime;
                const ts = childSnapshot.val().ts;
                //console.log(moment(createTime.date).format('LLLL'))
                onValue(child(ref(db), 'users/' + childKey), (snapshot) => {
                    const childData = snapshot.val();
                    users.push({
                        username: childData.username,
                        uid: childData.uid,
                        profileImage: childData.profile_picture,
                        status: childData.status,
                        lastMessage: lastMess,
                        messTime: messTime,
                        ts: ts
                    })
                });
            })
            users.sort((a, b) => b.ts - a.ts);
            setAllFriendChats(users);
            setUserBack(users);
        });
        return subcriber
    }, []);

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.Appbar}>
                <Appbar.Action icon="menu" />
                <Appbar.Content title="Chat App" />
                <Avatar.Image size={40} source={require('../../../src/images/user.png')} />
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
                                <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', { Username: item.username, pImage: item.profileImage, FriendId: item.uid, friendStatus: item.status })} style={{ flexDirection: 'row', borderBottomColor: 'gray', borderBottomWidth: 0.5, padding: 5 }}>
                                    <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                                        <Image style={{ width: 50, height: 50, borderRadius: 50 / 2 }} source={{ uri: item.profileImage }}></Image>
                                    </View>
                                    <View style={{ width: '70%', alignItems: 'flex-start', marginLeft: 10 }}>
                                        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>{item.username}</Text>
                                        <Text style={{ color: 'black', fontSize: 16 }}>{item.lastMessage}</Text>
                                    </View>
                                    <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                        {item.status === false ?
                                            <Ionicons name="radio-button-on" color='gray' size={18} />
                                            :
                                            <Ionicons name="radio-button-on" color='green' size={18} />
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
        backgroundColor: 'white'
    },
    status: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: 0,
        bottom: 0,
    }
})

export default HomeComponent