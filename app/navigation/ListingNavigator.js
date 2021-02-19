import React from 'react';
import {createStackNavigator} from "@react-navigation/stack"
import ListingDetailsScreen from '../screens/ListingDetailsScreen';
import ListingsScreen from '../screens/ListingsScreen';


const Stack = createStackNavigator();

const ListingNavigator = () => (
    <Stack.Navigator mode = "modal" screenOptions={{headerShown: false}}>
        <Stack.Screen name = "Restaurant" component={ListingsScreen}/>
        <Stack.Screen name = "Restaurant Profile" component={ListingDetailsScreen}/>
    </Stack.Navigator>
)

export default ListingNavigator;