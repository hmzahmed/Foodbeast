import React from 'react';
import {createStackNavigator} from "@react-navigation/stack"
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import editMenu from '../screens/editMenu';
import editMenuItem from '../screens/editMenuItem';


const Stack = createStackNavigator();

const EditMenuNavigator = () => (
    <Stack.Navigator mode="modal">
        <Stack.Screen  name = "Edit Menu" component={editMenu}/>
        <Stack.Screen  name = "Edit Menu Item" component={editMenuItem}/>
    </Stack.Navigator>
)

export default EditMenuNavigator;