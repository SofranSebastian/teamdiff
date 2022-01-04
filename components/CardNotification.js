import React, { useState } from 'react';
import { Text, View, Image } from 'react-native';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { db } from "../db/firebaseDB";
import { arrayUnion, doc, getDoc, arrayRemove } from "firebase/firestore";
import { collection, query, where, getDocs, updateDoc, increment, } from "firebase/firestore";

async function readNotification(props){
    const userRef = doc(db, "users", props.userID);
    const user = await getDoc(userRef);

    if( user.exists() ){
        for( let i = 0 ; i < user.data().notifications.length ; i++ ){
            if(user.data().notifications[i].timestamp === props.timestamp){
                let newNotification = user.data().notifications[i]
                newNotification.isRead = true;
                await updateDoc( userRef, {
                    notifications: arrayRemove(user.data().notifications[i])
                })
                await updateDoc( userRef, {
                    notifications: arrayUnion(newNotification)
                })
            }
        }
    }

}

function CardNotification(props){
    
    const [isRead, setIsRead] = useState(props.isRead); 
    
    return(
            <Card style={ 
                            {   width:"95%",
                                marginLeft:'2%',
                                marginVertical:'2%',
                                height:120,
                                borderRadius:15,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 3,
                                },
                                shadowOpacity: 0.29,
                                shadowRadius: 4.65,

                                elevation: 3,
                            } 
                        }
                        onPress={()=> {setIsRead(true);readNotification(props)}}
            >
                <View style={{
                            flex:1,
                            height:150,
                            borderRadius:15,
                        }}
                >
                    { isRead === false ?
                        <View style={{height:15, width:15, backgroundColor:"#262731", borderRadius:30, position:'absolute', right:20 , top:60}}>
                            
                        </View>
                    :
                        null
                    }
                    <View style={{  flex:0.8, marginTop:'2%'}}>

                        <Text style={{ marginLeft:'4%', fontSize:14, fontFamily:'normal-font', lineHeight:15,  color:"#262731" }}>
                                • Notification
                        </Text>
                        <Text numberOfLines={10} style={{ marginHorizontal:'4%', marginTop:'4%', fontSize:16, fontFamily:'normal-font', lineHeight:15,  color:"#262731" }}>
                            { props.message }
                        </Text>
                    </View>
                    <View style={{  flex:0.2,
                                }}>
                         
                    </View>
                    <View style={{ marginLeft:'4%', flexDirection:"row", alignItems:'center', justifyContent:'space-between', alignItems:'center'}}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Image source={{uri:"https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png"}}  style={{width:13, height:13}}/>

                            <Text numberOfLines={1} style={{ marginLeft:'2%',fontSize:10, fontFamily:'normal-font', lineHeight:15,  color:"#262731" }}>
                                { "At " +  new Date(props.timestamp).toUTCString()}
                            </Text>
                        </View>
                    </View>
                </View>
            </Card>
    )
};

export default CardNotification;