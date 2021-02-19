import React, { useContext, useEffect } from 'react';
import {MaterialCommunityIcons} from "@expo/vector-icons"
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import ListingEditScreen from '../screens/ListingEditScreen';
import ListingsScreen from '../screens/ListingsScreen';
import AccountScreen from '../screens/AccountScreen';
import FeedScreen from '../screens/FeedScreen';
import FeedNavigator from './FeedNavigator';
import ListingNavigator from './ListingNavigator';
import AccountNavigator from './AccountNavigator';
import * as firebase from "firebase"
import 'firebase/firestore';
import AuthContext from '../Auth/context';
import navigation from "./rootNavigation"

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    const authContext = useContext(AuthContext)

    useEffect(()=>{
        registerForPushNotifications()

        Notifications.addNotificationResponseReceivedListener((notification)=>{
            console.log(notification)
            navigation.naviagte("Account")
        })
    },[])

    const registerForPushNotifications = async () => {

        try {
            const permission =  await Permissions.askAsync(Permissions.NOTIFICATIONS)
            if(!permission.granted) return;
      
            const token = await Notifications.getExpoPushTokenAsync();
            firebase.firestore().collection("users").doc(authContext.userDetails.docId).update({nToken: token.data})
            
        } catch (error) {
            console.log("Error Getting Push Notification", error )
        }
    }
    
    return (
    <Tab.Navigator initialRouteName="Feed" >
        <Tab.Screen 
        options={{
            tabBarIcon: ({color, size}) => <MaterialCommunityIcons color={color} size={size} name = "silverware-fork-knife" />
        }}
        name = "Restaurants" component={ListingNavigator}/>
        <Tab.Screen
        options={{
            tabBarIcon: ({color, size}) => <MaterialCommunityIcons color={color} size={size} name = "account-group" />
        }}
        name = "Feed" component={FeedNavigator}/>
        <Tab.Screen
        options={{
            tabBarIcon: ({color, size}) => <MaterialCommunityIcons color={color} size={size} name = "account" />
        }}
        name = "Account" component={AccountNavigator}/>
    </Tab.Navigator>
)
    }

export default AppNavigator;
