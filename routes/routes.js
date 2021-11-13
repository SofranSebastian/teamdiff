import React from 'react';
import { Text, Image } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignUp from "../screens/SignUp";
import LogIn from "../screens/LogIn";
import Home from "../screens/Home";

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
                <MainStack.Screen   name = "LogIn"
                                    component = { LogIn }
                                    options = {
                                        ({ navigation, route }) => ({
                                            headerShown: false,
                                        })
                                    }

                />
                <MainStack.Screen   name = "Home"
                                    component = { Home }
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