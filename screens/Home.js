import React from "react";
import { Text, View, ImageBackground, SafeAreaView, FlatList, ScrollView, StatusBar } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { usersCol } from "../db/firebaseDB";
import { getFirestore, collection, getDocs, addDoc, doc, query, where, updateDoc, arrayUnion } from 'firebase/firestore';
import CardNews from "../components/CardNews";
const DATA = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "First Item",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Third Item",
    },
  ];
const dummyData = require('../dummyDataNews.json')
export default class Home extends React.Component {
    constructor() {
        super();
    
        this.data = dummyData.news
        console.log(this.data);

    }

    componentDidMount(){
        // fetch(  "https://current-news.p.rapidapi.com/news/technology", {
        //         "method": "GET",
        //         "headers": {
        //             "x-rapidapi-host": "current-news.p.rapidapi.com",
        //             "x-rapidapi-key": "baf44d4290msh54dc398cb97add8p194c17jsn9aab1e258a32"
        //         }
        //     })
        //     .then( 
        //         (response) => response.json()
        //     ).then( (responseData) => {
        //             this.data = responseData.news
        //             console.log(this.data)
        //         }
        //     )
        //     .catch(err => {
        //         console.error(err);
        //     });
        //this.data = dummyData.news;

        // for( var i in dummyData.news.length){
        //     this.data.push( dummyData.news[i] );
        // }
        // console.log(this.data);
    
        this.data = dummyData.news
    }


    render() {
        return (
                <SafeAreaView>
                    <View style={{ marginLeft:5, marginBottom:5, marginTop:'25%'}}>
                        <Text style={{ fontSize:20, fontFamily:'normal-font', fontWeight:'bold', color:"#262731" }}>TECH NEWS</Text>
                    </View>
                    <FlatList   scrollEnabled={ true }
                                horizontal={ true }
                                showsHorizontalScrollIndicator={ false }
                                data={ this.data }
                                renderItem={ ({item}) => <CardNews  title={ item.title }
                                                                    urlToImage={ item.urlToImage }
                                                                    url={ item.url }
                                                        /> 
                                        }
                                keyExtractor={ item => item.publishedAt}
                    />
                    <View style={{ marginLeft:5, marginBottom:5, marginTop:'5%'}}>
                        <Text style={{ fontSize:20, fontFamily:'normal-font', fontWeight:'bold', color:"#262731" }}>BUGS TO BE KILLED</Text>
                    </View>
                </SafeAreaView> 
        )   
    }
}

