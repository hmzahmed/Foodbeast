import React from 'react';
import {createStackNavigator} from "@react-navigation/stack"
import AccountScreen from '../screens/AccountScreen';
import OrderNavigator from './OrderNavigator'
import MessagesScreen from '../screens/MessagesScreen';
import addMenuItem from '../screens/addMenuItem';
import editMenu from '../screens/editMenu';
import EditMenuNavigator from './EditMenuNavigator';
import UpdateAccountScreen from '../screens/UpdateAccountScreen';
import myFoodbuddies from '../screens/myFoodbuddies';
import BuddyNavigator from './BuddyNavigator';
import Analytics from '../screens/Analytics';
import MessageNavigator from './MessageNavigaotr';


const Stack = createStackNavigator();

const AccountNavigator = () => (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name = "Account" component={AccountScreen}/>
        <Stack.Screen name = "Orders" component={OrderNavigator}/>
        <Stack.Screen name = "Add Menu Item" component={addMenuItem}/>
        <Stack.Screen name = "Edit Menu" component={EditMenuNavigator}/>
        <Stack.Screen name = "Update Account" component={UpdateAccountScreen}/>
        <Stack.Screen name = "Foodbuddy" component={BuddyNavigator}/>
        <Stack.Screen name = "Message" component={MessageNavigator}/>
        <Stack.Screen name = "Analytics" component={Analytics}/>
    </Stack.Navigator>
)

export default AccountNavigator;