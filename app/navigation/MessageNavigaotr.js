import React from 'react';
import {createStackNavigator} from "@react-navigation/stack"
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import MessagesScreen from '../screens/MessagesScreen';
import indTexting from '../screens/indTexting';


const Stack = createStackNavigator();

const MessageNavigator = () => (
    <Stack.Navigator mode="modal">
        <Stack.Screen  name = "Messages" component={MessagesScreen}/>
        <Stack.Screen  name = "Texting" component={indTexting}/>
    </Stack.Navigator>
)

export default MessageNavigator;