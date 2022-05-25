import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeComponent from '../components/HomeComponent';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons'
import ProfileComponent from '../components/ProfileComponent'
import StatusComponent from '../components/StatusComponent';
import FriendComponent from '../components/FriendComponent';

const Tab = createBottomTabNavigator();

const HomeScreens = () =>{

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="Home"
                component={HomeComponent}
                options={{
                    tabBarIcon: ({size, color}) => (<Icon name="home" color={color} size={size} />)
                }}
            />
            <Tab.Screen 
                name="Status" 
                component={StatusComponent}
                options={{
                    tabBarIcon: ({size, color}) => (<Icon name="heartbeat" color={color} size={size} />)
                }}
            />
            <Tab.Screen 
                name="Add Friend" 
                component={FriendComponent}
                options={{
                    tabBarIcon: ({size, color}) => (<Ionicons name="person-add" color={color} size={size} />)
                }}
            />
            <Tab.Screen 
                name="User" 
                component={ProfileComponent}
                options={{
                    tabBarIcon: ({size, color}) => (<Icon name="user" color={color} size={size} />)
                }}
            />
        </Tab.Navigator>
    )
}

export default HomeScreens