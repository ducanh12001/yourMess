import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Avatar } from 'react-native-paper'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { auth, db, storage } from '../../../src/firebase/config'
import {
	ScreenCapturePickerView,
	RTCPeerConnection,
	RTCIceCandidate,
	RTCSessionDescription,
	RTCView,
	MediaStream,
	MediaStreamTrack,
	mediaDevices,
	registerGlobals
} from 'react-native-webrtc';

const CallComponent = () => {
  const navigation = useNavigation();

  const [localStream, setLocalStream] = useState('');
  const [remoteStream, setRemoteStream] = useState('');
  const pc = useRef();
  let peerConstraints = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      }
    ],
    iceCandidatePoolSize: 10,
  };

  function SendCall() {
    return (
        <View style={styles.container}>
            <View style={styles.main}>
                <Avatar.Image size={70} source={{}} />
                <Text style={{fontSize: 30}}>Ten</Text>
                <Text style={{fontSize: 20}}>Đang gọi...</Text>
                <TouchableOpacity style={styles.endBtn} onPress={() => navigation.goBack()}>
                    <MaterialIcons name='call-end' size={30} color='white'/>
                </TouchableOpacity>
            </View>
        </View>
    )
  }

  function InCall() {
    return (
        <View style={styles.container}>
            <View style={styles.main}>
                <Avatar.Image size={70} source={{}} />
                <Text style={{fontSize: 30}}>Ten</Text>
                <Text style={{fontSize: 20}}>00:10</Text>
                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.btn}>
                        <FontAwesome name='microphone' size={30} color='white'/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn}>
                        <FontAwesome name='microphone-slash' size={30} color='white'/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn}>
                        <MaterialIcons name='videocam' size={30} color='white'/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn}>
                        <MaterialIcons name='videocam-off' size={30} color='white'/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.endBtn1} onPress={() => navigation.goBack()}>
                    <MaterialIcons name='call-end' size={30} color='white'/>
                </TouchableOpacity>
            </View>
        </View>
      )
  }

  return (
    <SendCall />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(206, 255, 247, 0.5)',
    padding: 50
  },
  main : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons : {
    flex: 1,
  },
  endBtn : {
    bottom: 0,
    position: 'absolute',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 50,
  },
  endBtn1 : {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 50,
  },
  btn : {
    alignItems:'center',
    justifyContent:'center',
    width:50,
    height:50,
    backgroundColor:'#c7c7c7',
    borderRadius:50,
  }
})

export default CallComponent