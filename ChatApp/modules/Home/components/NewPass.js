import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import React, { useState } from 'react'
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../src/config/firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

const NewPass = () => {
    const navigation = useNavigation();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword1, setNewPassword1] = useState('');
    const [newPassword2, setNewPassword2] = useState('');

    const resetPassword = (currentPass, newPass1, newPass2) => {
        newPass1 = newPass1.trim();
        newPass2 = newPass2.trim();
        //console.log(user);
        if (currentPass === '' || newPass1 === '' || newPass2 === '') {
            alert("Please enter details");
        } else if (newPass2 != newPass1) {
            alert('Passwords do not match')
        } else {
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, currentPass);
            reauthenticateWithCredential(user, credential).then(() => {
                updatePassword(user, newPass2).then(() => {
                    // Update successful.
                    alert("reset ok")
                    navigation.navigate('HomeScreen');
                }).catch((error) => {
                    alert(error)
                });
            }).catch((error) => {
                alert(error)
                if (error.code === 'auth/wrong-password') {
                    alert("Sai mật khẩu hiện tại")
                }
            })
        }
    }

    return (
        <View style={styles.container}>
            <Text>Đặt lại mật khẩu</Text>
            <TextInput
                style={styles.viewInput}
                label="Mật khẩu hiện tại"
                mode="flat"
                value={currentPassword}
                secureTextEntry
                onChangeText={text => setCurrentPassword(text)}>
            </TextInput>
            <TextInput
                style={styles.viewInput}
                label="Mật khẩu mới"
                mode="flat"
                value={newPassword1}
                secureTextEntry
                placeholder='do dai 6'
                onChangeText={text => setNewPassword1(text)}>
            </TextInput>
            <TextInput
                style={styles.viewInput}
                label="Lặp lại mật khẩu mới"
                mode="flat"
                value={newPassword2}
                secureTextEntry
                onChangeText={text => setNewPassword2(text)}>
            </TextInput>
            <Button mode="contained"
                style={[styles.cusButton]}
                theme={{ roundness: 0 }}
                onPress={() => resetPassword(currentPassword, newPassword1, newPassword2)}
            >Xác nhận
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    viewInput: {
        marginBottom: 15,
        backgroundColor: 'white'
    },
})

export default NewPass