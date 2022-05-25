import { useNavigation } from '@react-navigation/native';
import { child, onValue, push, ref, remove } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { Button, FlatList, Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { Searchbar} from 'react-native-paper'
import { auth, db } from '../../../../src/firebase/config';
import { SendRequest, RecieveRequest } from '../Friend/FriendFunction'

const AddFriendComponent = () => {

    const [addFr, setAddFr] = useState(false);
    const [isFriend, setIsFriend] = useState(true);
    const [allUsers, setAllUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [userBack, setUserBack] = useState([]);
    const [isExist, setIsExist] = useState(false);
    const [currentId, setCurrentId] = useState('');

    const searchUser = (val) => {
        if (val === "") {
            setIsOnList(false);
            setSearch(val);
        } else {
            setIsExist(true);
            setSearch(val);
            setAllUsers(userBack.filter((item) => item.idAdd === val));
        }
    }

    useEffect(() => {
        const currentId = auth.currentUser.uid;
        const subcriber = onValue(child(ref(db), 'users'), (snapshot) => {
                const users = [];
                snapshot.forEach((childSnapshot) => {
                    const childData = childSnapshot.val();
                    if (childData.uid === currentId) {
                        //console.log(uid);
                    } else {
                        users.push({
                            username: childData.username,
                            profileImage: childData.profile_picture,
                            idAdd: childData.idAdd,
                        })
                    }
                })
                setAllUsers(users);
                setUserBack(users);
        });
        return subcriber
    }, []);

    const addFriend = async (friendId) => {
        setAddFr(true);
    }

    const deleteFriend = async (friendId) => {
        setAddFr(false);
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
                    {isExist ?
                        <FlatList
                            alwaysBounceVertical={false}
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
                                            <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>{item.idAdd}</Text>
                                        </View>
                                        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                                            {!addFr ?
                                                <Button title="Them ban" onPress={addFriend} /> :
                                                <Button title="Xoa ban" onPress={deleteFriend} />
                                            }
                                        </View>
                                    </View>
                                )
                            }}
                        /> :
                        <View style={{flex: 1}} />
                    }
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