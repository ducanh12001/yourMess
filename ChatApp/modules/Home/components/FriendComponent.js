import React from 'react'
import { StyleSheet } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AddFriendComponent from './Friend/AddFriendComponent';
import SendRecieve from './Friend/SendRecieve';

const Tab = createMaterialTopTabNavigator();

const FriendComponent = () => {
    return (
        <Tab.Navigator initialRouteName="Find Friend">
            <Tab.Screen name="Find Friend" component={AddFriendComponent} />
            <Tab.Screen name="Request" component={SendRecieve} />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
})

export default FriendComponent