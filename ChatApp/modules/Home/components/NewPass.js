import { Keyboard, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
import React, { useState } from 'react'
import { Button, TextInput, Appbar } from 'react-native-paper';
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
            alert('Passwords không khớp')
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
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.bodyContainer}>
                    <Appbar.Header style={styles.Appbar}>
                        <Appbar.BackAction onPress={() => navigation.goBack()} />
                        <Appbar.Content title="Đặt lại mật khẩu" />
                    </Appbar.Header>
                    <View style={styles.body}>
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
                            placeholder='Ít nhất 6 kí tự'
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
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    Appbar: {
        backgroundColor: 'white'
    },
    body: {
        padding: 10,
        marginTop: 20
    },
    text: {
        alignSelf: 'center',
        fontSize: 22,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    viewInput: {
        marginBottom: 15,
        backgroundColor: 'white',
        borderWidth: 1,
    },
})

export default NewPass