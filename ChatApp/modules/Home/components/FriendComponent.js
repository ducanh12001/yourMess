import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AddFriendComponent from './Friend/AddFriendComponent';
import SendRecieve from './Friend/SendRecieve';

const Tab = createMaterialTopTabNavigator();

const FriendComponent = () => {
    return (
        <Tab.Navigator initialRouteName="Add Friend">
            <Tab.Screen name="Add Friend" component={AddFriendComponent} />
            <Tab.Screen name="Request" component={SendRecieve} />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
})

export default FriendComponent