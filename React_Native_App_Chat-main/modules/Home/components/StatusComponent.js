import { useNavigation } from '@react-navigation/core';
import { onValue, ref, push } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { auth, db } from '../../../src/firebase/config';

const StatusComponent = () =>{
    const navigation = useNavigation()

    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const dbRef = ref(db, '/users');
        const subcriber = onValue(dbRef, (snapshot) => {
            const uid = auth.currentUser.uid;
            const users = [];
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                if (childData.uid === uid) {

                } else {
                    users.push({ 
                        username: childData.username,
                        uid: childData.uid
                    })
                }
            });
            setAllUsers(users);
        }, {
            onlyOnce: true
        });
        return subcriber
    }, []);

    return (
        <View style={styles.container}>
            <Searchbar placeholder="Search" style={{borderRadius : 50, margin : 10,}} />
            <FlatList
                alwaysBounceVertical={false}
                style={{padding: 5}}
                data={allUsers}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => {return (
                    <TouchableOpacity style={{flexDirection: 'row', borderBottomColor: 'gray', borderBottomWidth: 0.5, padding:5}}>
                        <View style={{width: '15%', alignItems:'center', justifyContent: 'center'}}>
                            <Image style={{width: 50, height: 50, borderRadius: 50/ 2}}  source={require('../../../src/images/Avatar/Profile.jpg')}></Image>
                        </View>
                        <View style={{width: '85%', alignItems:'flex-start', marginLeft: 10}}>
                            <Text style={{color:'black', fontSize: 18, fontWeight:'bold'}}>{item.username}</Text>
                            <Text style={{color:'gray', fontSize: 15}}>aaaaaa</Text>
                        </View>
                    </TouchableOpacity>
                )}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container :{
        flex: 1,
    }
})

export default StatusComponent;