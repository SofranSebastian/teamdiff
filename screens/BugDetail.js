import React from "react";
import { Text, View, ImageBackground, SafeAreaView, FlatList, ScrollView, StatusBar } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { bugsCol } from "../db/firebaseDB";
import { doc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import CardNews from "../components/CardNews";
import CardBugs from "../components/CardBugs";
import BottomTabNavigator from "../components/BottomTabNavigator";

export default class BugDetail extends React.Component {
    constructor() {
        super();

    }



    render() {
        return (
                <SafeAreaView style={{ flex:1, backgroundColor:'white' }}>
                    <Text>
                        {this.props.route.params.screenTitle}
                    </Text>
                </SafeAreaView> 
        )   
    }
}

