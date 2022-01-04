import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Avatar, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from "../db/firebaseDB";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import CardNotification from '../components/CardNotification';
export default class Notifications extends React.Component{
    constructor(){
        super()

        this.userID = "";
        this.userName = "";

        this.state = {
            notificationsFromFirestore: [],
        }
    }


    async getIDfromAsyncStorage(){
        try {
          const value = await AsyncStorage.getItem('userID')
          if(value !== null) {
            this.userID = value;
          }
        } catch(e) {
          // error reading value
        }
        
    }

    async getNotifications(){
        await this.getIDfromAsyncStorage();

        const userRef = doc(db, "users", this.userID);
        const user = await getDoc(userRef);

        if( user.exists() ){

            var tempArray = [];
            for( let i = 0 ; i < user.data().notifications.length ; i++ ){
                var objectResponse = user.data().notifications[i]
                tempArray.push(objectResponse);
                tempArray.sort( function( a , b){
                    if(a.timestamp < b.timestamp) return 1;
                    if(a.timestamp > b.timestamp) return -1;
                    return 0;
                });
            }
            this.setState({ notificationsFromFirestore: tempArray});
            this.userName = user.data().username;
        } else {
          console.log("No such document!");
        }
    }
    
    async componentDidMount(){   
        await this.getNotifications();
    }




    render(){
        return(
            <View style={{flex:1, backgroundColor:'white'}}>
                <View style={{flexDirection:'row', flex:0.1, justifyContent:'space-between', alignItems:'flex-end'}}>
                    <IconButton
                        icon="chevron-left"
                        size={20}
                        onPress={() => this.props.navigation.reset({
                                                                index: 0,
                                                                routes: [{ name: "Home", }]
                                                                })                
                                }
                    />
                    <View style={{flexDirection:'row', flex:0.5, alignItems:'center'}}>
                        <Avatar.Icon size={40} icon="bell"  backgroundColor="white" color="#262731"/>
                        <Text style={{fontSize:20, fontFamily:'normal-font', fontWeight:'bold', color:"#262731"}}>
                            NOTIFICATIONS
                        </Text>
                    </View>
                    <View style={{flex:0.25, backgroundColor:'red'}}>

                    </View>
                </View>
                <View style={{flex:0.9}}>
                        <FlatList   
                                  data={ this.state.notificationsFromFirestore }
                                  renderItem={ ({item}) => <CardNotification    timestamp={item.timestamp}
                                                                                message={item.message}
                                                                                isRead={item.isRead}
                                                                                username={this.userName}
                                                                                userID={this.userID}
                                                            />
                                          }
                                  keyExtractor={ item => item.timestamp.toString()}
                        />
                </View>
            </View>
        )
    }

}