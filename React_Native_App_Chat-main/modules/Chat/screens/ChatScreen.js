import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Button, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Appbar, Avatar } from 'react-native-paper'
import FriendChat from '../components/FriendChat'
import MeChat from '../components/MeChat'

const ChatScreen = ({ route }) => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const { Username, pImage } = route.params;

  return (
    <View style={styles.container}>
      <View>
        <Appbar.Header style={styles.Appbar}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Avatar.Image size={40} source={{ uri: pImage }} />
          <Appbar.Content title={Username} />
        </Appbar.Header>
      </View>
      <ScrollView>
        <FriendChat />
        <MeChat />
        <MeChat />
      </ScrollView>
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ backgroundColor: 'gray', display: 'flex', flexDirection: 'row' }}>
            <TextInput style={{ borderRadius: 20, padding: 5, backgroundColor: 'white', margin: 10, flex: 3 }} placeholder="message" />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
    flex: 1,
    justifyContent: "space-around"
  },
  header: {
    fontSize: 36,
    marginBottom: 50
  },
  textInput: {
    marginBottom: 50
  },
  btnContainer: {
    marginTop: 20
  },
  Appbar: {
    backgroundColor: 'white'
  }
})

export default ChatScreen