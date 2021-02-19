import React from 'react';
import {createStackNavigator} from "@react-navigation/stack"

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

const Stack = createStackNavigator();

const AuthNavigator = () => (
    <Stack.Navigator >
        <Stack.Screen options={{headerShown: false}} name = "Welcome" component={WelcomeScreen}></Stack.Screen>
        <Stack.Screen name = "Login" component={LoginScreen}></Stack.Screen>
        <Stack.Screen name = "Register" component={RegisterScreen}></Stack.Screen>
    </Stack.Navigator>
)

export default AuthNavigator;