import React from 'react';
import {createStackNavigator} from "@react-navigation/stack"
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';


const Stack = createStackNavigator();

const OrderNavigator = () => (
    <Stack.Navigator mode="modal">
        <Stack.Screen  name = "Orders" component={OrdersScreen}/>
        <Stack.Screen  name = "Order Details" component={OrderDetailScreen}/>
    </Stack.Navigator>
)

export default OrderNavigator;