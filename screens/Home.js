import React from "react";
import { Text, View, ImageBackground, SafeAreaView, FlatList } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { usersCol } from "../db/firebaseDB";
import { getFirestore, collection, getDocs, addDoc, doc, query, where, updateDoc, arrayUnion } from 'firebase/firestore';

export default class Home extends React.Component {
    constructor() {
        super();
    }

    componentDidMount(){
        fetch(  "https://current-news.p.rapidapi.com/news/technology", {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "current-news.p.rapidapi.com",
                    "x-rapidapi-key": "baf44d4290msh54dc398cb97add8p194c17jsn9aab1e258a32"
                }
            })
            .then( 
                (response) => response.json()
            ).then( (responseData) =>
                console.log(responseData)
            )
            .catch(err => {
                console.error(err);
            });
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                    <FlatList
                        data={DATA}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                    
                <Text style={ {fontSize: 20} }>Home</Text>
            </SafeAreaView>
        )   
    }
}

