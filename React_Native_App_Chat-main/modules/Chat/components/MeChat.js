import React, { useState } from 'react'
import { Text, TextInput } from 'react-native-paper'
import { Dimensions, StyleSheet, useWindowDimensions, View } from 'react-native';
const MeChat = () => {
  const [messages, setMessages] = useState([]);
  const {height} = useWindowDimensions();
  const windowWidth = Dimensions.get('window').width;
  
  return (
    <View style={[styles.view,{width : windowWidth*0.7,marginLeft : windowWidth*0.3}]}> 
      <Text style={styles.text}>me send friend message and user then send message</Text>
    </View>
  )
}

const styles= StyleSheet.create({
  view : {
    margin : 10
  },
  text : {
    width : '100%',
    borderWidth : 1,
    color :'#373b3b',
    borderColor :'#0ccdff',
    fontSize : 18,
    borderRadius : 8,
    backgroundColor : '#24C1E8',
    padding : 5
  }
})

export default MeChat
