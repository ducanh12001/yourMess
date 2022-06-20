import { Keyboard, KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react'
import { Button, TextInput, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../src/config/firebase';
import { sendPasswordResetEmail } from "firebase/auth";

const ResetPassword = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');

    const resetPassword = (email) => {
        email = email.trim();
        if (email === '') {
            alert('Vui lòng điền email')
        } 
        sendPasswordResetEmail(auth, email)
        .then(() => {
            // Password reset email sent!
            alert('Gửi thành công, kiểm tra email')
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (error.code === 'auth/invalid-email' && email != '') {
                alert('Email không hợp lệ!');
            } else {
                alert(errorCode)
            }
        });
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
                            label="Email"
                            mode="flat"
                            theme={{ roundness: 0 }}
                            value={email}
                            onChangeText={text => setEmail(text)}>
                        </TextInput>
                        <Button mode="contained"
                            style={[styles.cusButton]}
                            theme={{ roundness: 0 }}
                            onPress={() => resetPassword(email)}
                        >Gửi
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

export default ResetPassword