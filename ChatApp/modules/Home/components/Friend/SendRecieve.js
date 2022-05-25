import { useNavigation } from '@react-navigation/native';
import { child, onValue, ref} from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { Button, FlatList, Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { Searchbar } from 'react-native-paper'
import { auth, db } from '../../../../src/firebase/config';
import { AcceptRequest, DenyRequest } from '../Friend/FriendFunction'

const SendRecieve = () => {

    const [allRequest, setAllRequest] = useState([])

    const AcceptRequest = () => {
        console.log("accept")
    }

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
                                <View style={{ flexDirection: 'row', borderBottomColor: 'gray', borderBottomWidth: 0.5, padding: 5, flex: 1 }}>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image style={{ width: 50, height: 50, borderRadius: 50 / 2 }} source={{ uri: item.profileImage }}></Image>
                                    </View>
                                    <View style={{ flex: 3, marginLeft: 10 }}>
                                        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>{item.idAdd}</Text>
                                    </View>
                                    <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                                        <Button title="Chap nhan" onPress={AcceptRequest} />
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