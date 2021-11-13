import React from "react";
import { Text, View, ImageBackground, } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { usersCol } from "../db/firebaseDB";
import { getFirestore, collection, getDocs, addDoc, doc, query, where, updateDoc, arrayUnion } from 'firebase/firestore';

export default class Home extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <View>
                <Text style={ {fontSize: 20} }>Home</Text>
            </View>
        )   
    }
}

