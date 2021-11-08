import React from 'react';
import { Text, Image } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignUp from "../screens/SignUp";

const MainStack = createNativeStackNavigator();

function AppMainStack() {
    return(
        <NavigationContainer>
            <MainStack.Navigator>
                <MainStack.Screen   name = "SignUp"
                                component = { SignUp }
                                options = {
                                    ({ navigation, route }) => ({
                                        headerShown: false,
                                    })
                                }

                />
            </MainStack.Navigator>
        </NavigationContainer>
    )
}

export default AppMainStack;