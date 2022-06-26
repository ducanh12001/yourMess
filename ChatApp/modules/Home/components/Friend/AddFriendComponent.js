import { useNavigation } from '@react-navigation/native';
import { child, onValue, push, ref, remove } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { Button, FlatList, Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { Searchbar } from 'react-native-paper'
import { auth, db } from '../../../../src/config/firebase';
import { SendRequest, RecieveRequest, DeclineRequest, CheckFriend, DeleteFriend } from './FriendFunction';

const AddFriendComponent = () => {
    const navigation = useNavigation();

    const [addFr, setAddFr] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [userBack, setUserBack] = useState([]);
    const [isExist, setIsExist] = useState(false);
    const [currentId, setCurrentId] = useState('');

    const searchUser = (val) => {
        /*if (val === "") {
            setIsExist(false);
            setSearch(val);
        } else {
            setSearch(val);
            let arr = allUsers.filter((item) => item.idAdd === val )
            if (arr && arr.length) {
                setUserBack(arr)
                setIsExist(true);
            } else {
                setIsExist(false);
            }
        }*/
        setSearch(val);
        setAllUsers(userBack.filter((item) => item.idAdd.toLowerCase().match(val.toLowerCase())));
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const currentId = auth.currentUser.uid;
            setCurrentId(currentId);
            const subcriber = onValue(child(ref(db), 'users'), (snapshot) => {
                const users = [];
                snapshot.forEach((childSnapshot) => {
                    const childData = childSnapshot.val();
                    if (childData.uid === currentId) {
                        //console.log(uid);
                    } else {
                        let isFriend = false;
                        onValue(child(ref(db), `users/${currentId}/friendList`), (snapshot) => {
                            snapshot.forEach((childSnapshot) => {
                                const childData2 = childSnapshot.val();
                                const childKey = childSnapshot.key;
                                if (childKey === childData.uid) {
                                    isFriend = childData2.isFriend
                                } else {
                                    isFriend = !childData2.isFriend
                                }
                            })
                        })
                        users.push({
                            uid: childData.uid,
                            username: childData.username,
                            profileImage: childData.profile_picture,
                            idAdd: childData.idAdd,
                            buttonTitle: 'Thêm bạn',
                            isFriend: isFriend
                        })
                    }
                })
                setAllUsers(users);
                setUserBack(users);
                //console.log(users)
            });
        })
        return unsubscribe;
    }, [navigation]);


    const addFriend = (friendId) => {
        SendRequest(currentId, friendId).then((res) => {
        }).catch(err => {
            alert(err);
        })
        RecieveRequest(currentId, friendId).then((res) => {
        }).catch(err => {
            alert(err);
        })
        let arr = allUsers.filter((item, index) => {
            if (item.uid === friendId) {
                item.buttonTitle = 'Hủy mời'
            }
            return { ...item }
        })
        setAllUsers(arr);
    }

    const stopSend = (friendId) => {
        DeclineRequest(currentId, friendId).then((res) => {
            let arr = allUsers.filter((item, index) => {
                if (item.uid === friendId) {
                    item.buttonTitle = 'Thêm bạn'
                }
                return { ...item }
            })
            setAllUsers(arr);
        }).catch(err => {
            alert(err);
        })
    }

    const deleteFriend = (friendId) => {
        DeleteFriend(currentId, friendId).then((res) => {
            let arr = allUsers.filter((item, index) => {
                if (item.uid === friendId) {
                    item.buttonTitle = 'Thêm bạn'
                }
                return { ...item }
            })
            setAllUsers(arr);
        }).catch(err => {
            alert(err)
        })
    }


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Searchbar
                        placeholder="Search user id"
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
                                <View style={{ flexDirection: 'row', borderBottomColor: 'gray', borderBottomWidth: 0.5, padding: 5, flex: 1 }}>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image style={{ width: 50, height: 50, borderRadius: 50 / 2 }} source={{ uri: item.profileImage }}></Image>
                                    </View>
                                    <View style={{ flex: 3, marginLeft: 10 }}>
                                        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>{item.username}</Text>
                                        <Text style={{ color: 'black', fontSize: 18 }}>{item.idAdd}</Text>
                                    </View>
                                    <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                                        {item.buttonTitle === 'Thêm bạn' && !item.isFriend ?
                                            <Button title="Thêm bạn" onPress={() => addFriend(item.uid)} />
                                            : item.buttonTitle === 'Hủy mời' && !item.isFriend ?
                                                <Button title="Hủy mời" onPress={() => stopSend(item.uid)} />
                                                : item.isFriend ?
                                                    <Button title="Hủy kết bạn" onPress={() => deleteFriend(item.uid)} />
                                                    : <></>
                                        }
                                    </View>
                                </View>
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
        flex: 1,
    }
})

export default AddFriendComponent