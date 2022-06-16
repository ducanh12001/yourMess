import { useNavigation } from '@react-navigation/core';
import { child, get, onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { Searchbar } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { auth, db } from '../../../src/firebase/config';

const StatusComponent = () => {
    const navigation = useNavigation()

    const [allUsers, setAllUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [userBack, setUserBack] = useState('');

    const searchUser = (val) => {
        setSearch(val);
        setAllUsers(userBack.filter((item) => item.username.toLowerCase().match(val.toLowerCase())));
    }

    useEffect(() => {
        const subcriber = onValue(child(ref(db), 'users'), (snapshot) => {
            if (auth.currentUser) {
                const uid = auth.currentUser.uid;
                const users = [];
                snapshot.forEach((childSnapshot) => {
                    const childData = childSnapshot.val();
                    if (childData.uid === uid) {
                        //console.log(uid);
                    } else {
                        users.push({
                            username: childData.username,
                            uid: childData.uid,
                            profileImage: childData.profile_picture,
                            status: childData.status
                        })
                    }
                })
                setAllUsers(users);
                setUserBack(users);
            }
        });
        return subcriber
    }, []);

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search user"
                style={{ borderRadius: 50, margin: 10, }}
                onChangeText={val => searchUser(val)}
                value={search}
            />
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
                                <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', { Username: item.username, pImage: item.profileImage, FriendId: item.uid, friendStatus: item.status })} style={{ flexDirection: 'row', borderBottomColor: 'gray', borderBottomWidth: 0.5, padding: 5 }}>
                                    <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                                        <Image style={{ width: 50, height: 50, borderRadius: 50 / 2 }} source={{ uri: item.profileImage }}></Image>
                                    </View>
                                    <View style={{ width: '75%', alignItems: 'flex-start', marginLeft: 10 }}>
                                        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>{item.username}</Text>
                                    </View>
                                    <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                                        {item.status === false ?
                                            <Ionicons name="radio-button-on" color='gray' size={18} />
                                            :
                                            <Ionicons name="radio-button-on" color='green' size={18} />
                                        }
                                    </View>
                                </TouchableOpacity>

                            }
                        </>
                    )
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default StatusComponent;