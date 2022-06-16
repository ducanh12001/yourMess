import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Avatar } from 'react-native-paper'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const ReceiveCall = () => {
    const navigation = useNavigation();

    function ReceiveCall() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Avatar.Image size={70} source={{}} />
                    <Text style={{ fontSize: 30 }}>Ten</Text>
                </View>
                <View style={styles.btnView}>
                    <TouchableOpacity style={styles.endBtn} onPress={() => navigation.goBack()}>
                        <MaterialIcons name='call-end' size={30} color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.callBtn} onPress={() => navigation.goBack()}>
                        <MaterialIcons name='call' size={30} color='white' />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <ReceiveCall />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(206, 255, 247, 0.5)',
        padding: 50
    },
    btnView: {
        flex: 1, 
        justifyContent: 'space-between', 
        flexDirection: 'row', 
        alignItems: 'flex-end'
    },
    endBtn: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 50,
    },
    callBtn: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 50,
    }
})

export default ReceiveCall