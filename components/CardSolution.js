import * as React from 'react';
import { TouchableOpacity,  Linking, Text, View, Image } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CardSolution(props){
    return(
            <Card style={{  width:"95%",
                            marginLeft:'2%',
                            marginVertical:'2%',
                            height:175,
                            borderRadius:15,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 3,
                            },
                            shadowOpacity: 0.29,
                            shadowRadius: 4.65,

                            elevation: 3,
                        }}
            >
                <View style={{
                            flex:1,
                            height:150,
                            borderRadius:15,
                        }}
                >
                    <View style={{  flex:0.8, marginTop:'2%'}}>
                        {  props.ownerUsername === props.loggedUsername ?
                            <Text style={{ marginLeft:'4%', fontSize:16, fontFamily:'normal-font', lineHeight:15,  color:"#262731" }}>
                                • Information
                            </Text>
                        :
                            <Text style={{ marginLeft:'4%', fontSize:16, fontFamily:'normal-font', lineHeight:15,  color:"#262731" }}>
                                • Solution
                            </Text>
                        }
                        <Text numberOfLines={10} style={{ marginHorizontal:'4%', fontSize:14, fontFamily:'normal-font', lineHeight:15,  color:"#262731" }}>
                            { props.description }
                        </Text>
                    </View>
                    <View style={{  flex:0.2,
                                }}>
                         
                    </View>
                    <View style={{ marginLeft:'2%', flexDirection:"row", alignItems:'center', justifyContent:'space-between', alignItems:'center'}}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Image source={{uri:"https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png"}}  style={{width:13, height:13}}/>

                            <Text numberOfLines={1} style={{ marginLeft:'2%',fontSize:10, fontFamily:'normal-font', lineHeight:15,  color:"#262731" }}>
                                { "Posted by " + props.ownerUsername + " at " +  new Date(props.timestamp).toUTCString()}
                            </Text>
                        </View>
                        { ( props.isAbleToDecide === true ) && ( props.ownerUsername !== props.loggedUsername  ) ?
                            <IconButton icon="star"
                                        size={20}
                                        color="white"
                                        style={{backgroundColor:"#262731"}}
                                        onPress={() => console.log('Pressed')}
                            />
                        :
                            null
                        }
                    </View>
                </View>
            </Card>
    )
};

export default CardSolution;