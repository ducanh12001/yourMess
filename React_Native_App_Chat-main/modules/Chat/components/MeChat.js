import React, { useState } from 'react'
import { Text, TextInput } from 'react-native-paper'
import { Dimensions, StyleSheet, useWindowDimensions, View } from 'react-native';
import moment from 'moment';
import 'moment/locale/vi'

const MeChat = () => {
  const [messages, setMessages] = useState([]);

  const isCurrentUser = false;
  //LT
  const time = moment();
  time.locale('vi');
  const createAt = time.format('LT');
  
  return (
    <View style={[styles.view, isCurrentUser? styles.viewRight : styles.viewLeft]}>
      <Text style={[styles.text, {color: isCurrentUser ? 'white' : 'black'}]}>ajjjjjajs</Text>
      <Text style={styles.time}>{createAt}</Text>
    </View>
  )
}

const styles= StyleSheet.create({
  viewLeft : {
    margin : 10,
    padding : 10,
    borderRadius : 20,
    maxWidth : '75%',
    backgroundColor : '#82eb5a',
    marginRight: 'auto'
  },
  viewRight : {
    margin : 10,
    padding : 10,
    borderRadius : 20,
    maxWidth : '75%',
    backgroundColor : '#17a2e6',
    marginLeft: 'auto'
  },
  text : {
    color :'#373b3b',
    fontSize : 18,
    marginBottom: 5
  },
  time : {
    color: '#585b5d'
  }
})

export default MeChat
