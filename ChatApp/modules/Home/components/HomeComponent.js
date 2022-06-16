import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { Appbar, Avatar, Searchbar } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, db } from '../../../src/firebase/config';

const HomeComponent = () =>{
    const navigation = useNavigation();

    const [search,setSearch] = useState('');
    const [allFriendChats, setAllFriendChats] = useState([]);
    const [userBack, setUserBack] = useState('');

    const searchUser = (val) => {
        setSearch(val);
        //setAllFriendChats(userBack.filter((item) => item.username.toLowerCase().match(val.toLowerCase())));
    }

    return(
        <View style={styles.container}>
            <Appbar.Header style={styles.Appbar}>
               <Appbar.Action icon="menu" />
               <Appbar.Content title="Chat App" />
               <Avatar.Image size={40} source={require('../../../src/images/user.png')} />
            </Appbar.Header>
            <Searchbar
                placeholder="Search user"
                style={{ borderRadius: 50, margin: 10, }}
                onChangeText={val => searchUser(val)}
                value={search}
            />
            <FlatList
                style={{ padding: 5 }}
                data={[]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    return (
                        <>
                            {item.uid === undefined ?
                                <View></View>
                                :
                                <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', { Username: item.username, pImage: item.profileImage, FriendId: item.uid, friendStatus: item.status })} style={{ flexDirection: 'row', borderBottomColor: 'gray', borderBottomWidth: 0.5, padding: 5 }}>
                                    <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                                        <Image style={{ width: 50, height: 50, borderRadius: 50 / 2 }} source={{ uri: item.profileImage }}></Image>
                                    </View>
                                    <View style={{ width: '75%', alignItems: 'flex-start', marginLeft: 10 }}>
                                        <Text style={{ color: 'black', fontSize: 20, fontWeight: 'bold' }}>{item.username}</Text>
                                    </View>
                                    <View style={{ width: '10%', justifyContent: 'center', alignItems: 'center' }}>
                                        {item.status === false ?
                                            <Ionicons name="radio-button-on" color='gray' size={18} />
                                            :
                                            <Ionicons name="radio-button-on" color='green' size={18} />
                                        }
                                    </View>
                                </TouchableOpacity>

                            }
                        </>
                    )
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    Appbar : {
        backgroundColor : 'white'
    },
})

export default HomeComponent