import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { Avatar } from 'react-native-paper'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { auth, db, storage } from '../../../src/firebase/config'
import { MediaStream, RTCView, mediaDevices } from 'react-native-webrtc'

const VideoScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={{ flex: 1, alignItems: 'center' }}>
                
            </View>
            <View>
                <TouchableOpacity style={styles.endBtn} onPress={() => navigation.goBack()}>
                    <MaterialIcons name='call-end' size={30} color='white' />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

})

export default VideoScreen