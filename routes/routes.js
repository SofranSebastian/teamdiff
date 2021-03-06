import React from 'react';
import { Text, Image, View, TouchableOpacity } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import SignUp from "../screens/SignUp";
import LogIn from "../screens/LogIn";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import AddBug from "../screens/AddBug";
import BugDetail from "../screens/BugDetail";
import AddSolution from '../screens/AddSolution';
import AddInformation from '../screens/AddInformation';
import CameraScreen from '../screens/CameraScreen';
import Notifications from '../screens/Notifications';

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
                                            headerShown:false,
                                        })
                                    }

                />
                <MainStack.Screen   name = "AddBug"
                                    component = { AddBug }
                                    options = {
                                        ({ navigation, route }) => ({
                                            headerShown:false,
                                        })
                                    }
                />
                <MainStack.Screen   name = "Profile"
                                    component = { Profile }
                                    options = {
                                        ({ navigation, route }) => ({
                                            headerShown:false,
                                        })
                                    }
                />
                <MainStack.Screen   name = "BugDetail"
                                    component = { BugDetail }
                                    options = {
                                        ({ navigation, route }) => ({
                                            headerShown:false,
                                        })
                                    }
                />
                <MainStack.Screen   name = "AddSolution"
                                    component = { AddSolution }
                                    options = {
                                        ({ navigation, route }) => ({
                                            headerShown:false,
                                        })
                                    }
                />
                <MainStack.Screen   name = "AddInformation"
                                    component = { AddInformation }
                                    options = {
                                        ({ navigation, route }) => ({
                                            headerShown:false,
                                        })
                                    }
                />      
                <MainStack.Screen   name = "CameraScreen"
                                    component = { CameraScreen }
                                    options = {
                                        ({ navigation, route }) => ({
                                            headerShown:false,
                                        })
                                    }
                />        
                <MainStack.Screen   name = "Notifications"
                                    component = { Notifications }
                                    options = {
                                        ({ navigation, route }) => ({
                                            headerShown:false,
                                        })
                                    }
                />                               
            </MainStack.Navigator>
        </NavigationContainer>
    )
}

export default AppMainStack;