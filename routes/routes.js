import React from 'react';
import { Text, Image } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import SignUp from "../screens/SignUp";
import LogIn from "../screens/LogIn";
import Home from "../screens/Home";
import Profile from "../screens/Profile";

const MainStack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator()

function MaterialTab() {
    return(
        <Tab.Navigator>
            <Tab.Screen name='Home'  
                        component={Home} 
                        options={{ 
                            tabBarIcon: ({color}) => (
                                <MaterialCommunityIcons  name={'calendar-arrow-right'} color={color} size={25}/>
                            ),
                            tabBarLabel: <Text style={{fontWeight:'bold', fontSize:12}}>Programeaza</Text>
                            
                        }}
            />
            <Tab.Screen name='Profile'  
                        component={Profile} 
                        options={{ 
                            tabBarIcon: ({color}) => (
                                <MaterialCommunityIcons  name={'calendar-arrow-right'} color={color} size={25}/>
                            ),
                            tabBarLabel: <Text style={{fontWeight:'bold', fontSize:12}}>Programeaza</Text>
                            
                        }}
            />
        </Tab.Navigator>
    )
}

function AppMainStack() {
    return(
        <NavigationContainer>
            <MainStack.Navigator>
                {/* <MainStack.Screen   name = "SignUp"
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

                /> */}
                <MainStack.Screen   name = "TabNavigator"
                                    component = { MaterialTab }
                                    options = {
                                        ({ navigation, route }) => ({
                                            headerShown:false,
                                        })
                                    }
                                    layout

                />
            </MainStack.Navigator>
        </NavigationContainer>
    )
}

export default AppMainStack;