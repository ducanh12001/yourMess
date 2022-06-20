import React from 'react';
import { Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
import { Card } from 'react-native-paper';
import SignUpForm from '../components/SignUpForm';

const SignUpScreen = () => {
    const { height } = useWindowDimensions();

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.root}>
                <Card style={[styles.cardView, { height: height * 0.9 }]}>
                    <View style={styles.imageView}>
                        <Image source={require('../../../src/images/Logo.png')}
                            style={[styles.logo, { height: height * 0.15 }]}
                            resizeMode="contain"
                        />
                    </View>
                    <Text></Text>
                    <View style={styles.formView}>
                        <SignUpForm />
                    </View>
                </Card>
            </View>
        </TouchableWithoutFeedback>
    )
}


const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        paddingTop: 10,
        flex: 1,
    },
    cardView: {
        alignItems: 'center',
        padding: 20,
        margin: 'auto',
        width: '100%',
        display: 'flex',
        maxWidth: 370,
    },
    logo: {
        maxWidth: 340,
        maxHeight: 150,
    },
    imageView: {
        alignItems: 'center',
    },
    formView: {
        display: 'flex',

    },
    textError: {
        color: 'red',
    }
});

export default SignUpScreen;