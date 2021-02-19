import React from 'react';
import {createStackNavigator} from "@react-navigation/stack"
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import myFoodbuddies from '../screens/myFoodbuddies';
import UserDetailScreen from '../screens/UserDetailScreen';


const Stack = createStackNavigator();

const BuddyNavigator = () => (
    <Stack.Navigator mode="modal">
        <Stack.Screen  name = "Foodbuddy" component={myFoodbuddies}/>
        <Stack.Screen  name = "Profile" component={UserDetailScreen}/>
    </Stack.Navigator>
)

export default BuddyNavigator;