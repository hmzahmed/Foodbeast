import React from 'react';
import {createStackNavigator} from "@react-navigation/stack"
import FeedScreen from '../screens/FeedScreen';
import ListingEditScreen from '../screens/ListingEditScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import CheckInScreen from '../screens/CheckInScreen';

const Stack = createStackNavigator();

const FeedNavigator = () => (
    <Stack.Navigator mode = "modal" screenOptions={{headerShown: false}}>
        <Stack.Screen name = "Feed" component={FeedScreen}/>
        <Stack.Screen name = "New Post" component={ListingEditScreen}/>
        <Stack.Screen name = "Profile" component={UserDetailScreen}/>
        <Stack.Screen name = "CheckIn" component={CheckInScreen}/>
    </Stack.Navigator>
)

export default FeedNavigator;