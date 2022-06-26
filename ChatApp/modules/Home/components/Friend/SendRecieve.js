import { child, onValue, ref } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { Button, FlatList, Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { auth, db } from '../../../../src/config/firebase'
import { AcceptRequest, DeclineRequest } from './FriendFunction'

const SendRecieve = () => {

    const [currentId, setCurrentId] = useState('');
    const [allRequest, setAllRequest] = useState([])

    const Accept = (friendId) => {
        AcceptRequest(currentId, friendId).then((res) => {
        }).catch(err => {
            alert(err);
        })
    }

    const Decline = (friendId) => {
        DeclineRequest(currentId, friendId).then((res) => {
        }).catch(err => {
            alert(err);
        })
    }

    useEffect(() => {
        const currentId = auth.currentUser.uid;
        setCurrentId(currentId);
        const request = onValue(child(ref(db), `requests/${currentId}`), (snapshot) => {
            const requests = [];
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                const childKey = childSnapshot.key;
                if (childData.request_type === 'recieve') {
                    onValue(child(ref(db), `users/${childKey}`), (snapshot) => {
                        requests.push({
                            userId: childKey,
                            username: snapshot.val().username,
                            userImage: snapshot.val().profile_picture,
                            idAdd: snapshot.val().idAdd
                        })
                    })
                }
            })
            setAllRequest(requests);
        });
        return request
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <FlatList
                        alwaysBounceVertical={false}
                        style={{ padding: 5 }}
                        data={allRequest}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                            return (
                                <View style={{ flexDirection: 'row', borderBottomColor: 'gray', borderBottomWidth: 0.5, padding: 5, flex: 1, justifyContent: 'center' }}>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image style={{ width: 50, height: 50, borderRadius: 50 / 2 }} source={{ uri: item.userImage }}></Image>
                                    </View>
                                    <View style={{ flex: 3, marginLeft: 10 }}>
                                        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>{item.username}</Text>
                                        <Text style={{ color: 'black', fontSize: 18 }}>{item.idAdd}</Text>
                                    </View>
                                    <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Button title="Chấp nhận" onPress={() => Accept(item.userId)} />
                                        <Button title="Từ chối" onPress={() => Decline(item.userId)} />
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

export default SendRecieve