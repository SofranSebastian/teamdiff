import React from 'react';
import { View, Text, ImageBackground, FlatList } from 'react-native';
import { IconButton, Avatar } from 'react-native-paper';
import { bugsCol } from "../db/firebaseDB";
import {  where, getDocs, query } from "@firebase/firestore";
import CardBugs from '../components/CardBugs';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Profile extends React.Component{
    constructor(){
        super()

        this.bugsFromFirestore = [];
        this.userID = "";

        this.state = {
            stateBugsArray: [],
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

    async getMyBugs(){
        await this.getIDfromAsyncStorage()
        const userID = this.userID;
        console.log(userID)
        const q = query(bugsCol, where("ownerID", "==", userID))
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            querySnapshot.forEach(bug => {
                var bugFromFirestore = bug.data();
                this.bugsFromFirestore.push(bugFromFirestore)
            })
            return true;
        }
        return false;
    }

    async componentDidMount(){
        await this.getMyBugs()
        this.setState({ stateBugsArray: this.bugsFromFirestore })
    }

    render(){
        return(
            <View style={{flex:1, backgroundColor:'white'}}>
                <View style={{flexDirection:'row', flex:0.1, justifyContent:'space-between', alignItems:'flex-end'}}>
                    <IconButton
                        icon="chevron-left"
                        size={20}
                        onPress={() => this.props.navigation.navigate("Home")}
                    />
                    <View style={{flexDirection:'row', flex:0.5, alignItems:'center'}}>
                        <Avatar.Icon size={40} icon="account"  backgroundColor="white" color="#262731"/>
                        <Text style={{fontSize:20, fontFamily:'normal-font', fontWeight:'bold', color:"#262731"}}>
                            PROFILE
                        </Text>
                    </View>
                    <View>

                    </View>
                </View>
                <View style={{flex:0.9}}>
                    <View style={{backgroundColor:"#262731", marginLeft:5, marginVertical:5, alignSelf:'flex-start', borderRadius:20}}>
                      <Text style={{  paddingHorizontal:10, paddingVertical:5, fontSize:10, fontFamily:'normal-font', fontWeight:'bold', color:"white" }}>📈   YOUR STATS</Text>
                    </View>
                    <ImageBackground    source={{uri:"https://res.cloudinary.com/practicaldev/image/fetch/s--9yBkqrjS--/c_imagga_scale,f_auto,fl_progressive,h_500,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nphrgz8yfnjylrwfr0yl.png"}} 
                                        resizeMode="cover" 
                                        style={{backgroundColor: "#262731",
                                        marginHorizontal: 5,
                                        height: 200,
                                        justifyContent:'space-around',
                                        alignItems:'center',
                                        borderRadius:20,
                                        overflow:'hidden'  }}>
                        <View style={{alignItems:'center'}}>
                            <Text style={{fontSize:16, fontFamily:'normal-font', fontWeight:'bold', color:"white"}}>BUGS KILLED</Text>
                            <Text style={{fontSize:16, fontFamily:'normal-font', color:"white"}}>378</Text>
                        </View>
                        <View style={{alignItems:'center'}}>
                            <Text style={{fontSize:16, fontFamily:'normal-font', fontWeight:'bold', color:"white"}}>BUGS SCORE</Text>
                            <Text style={{fontSize:16, fontFamily:'normal-font', color:"white"}}>4234</Text>
                        </View>
                        <View style={{alignItems:'center'}}>
                            <Text style={{fontSize:16, fontFamily:'normal-font', fontWeight:'bold', color:"white"}}>BUGS REPORTED</Text>
                            <Text style={{fontSize:16, fontFamily:'normal-font', color:"white"}}>59</Text>
                        </View>
                    </ImageBackground>
                    <View style={{backgroundColor:"#262731", marginLeft:5, marginTop:15, marginBottom:5, alignSelf:'flex-start', borderRadius:20}}>
                      <Text style={{  paddingHorizontal:10, paddingVertical:5, fontSize:10, fontFamily:'normal-font', fontWeight:'bold', color:"white" }}>⭕  YOUR BUGS</Text>
                    </View>
                    <FlatList   scrollEnabled={ true }
                                data={ this.state.stateBugsArray }
                                renderItem={ ({item}) => <CardBugs  title={ item.title }
                                                                    cost={ item.cost }
                                                                    description={ item.description }
                                                                    navigation={ this.props.navigation }
                                                                    category={ item.category }
                                                                    needToSeeIfItIsResolved={ true }
                                                                    isResolved = { item.isResolved }
                                                          /> 
                                }
                                keyExtractor={ item => item.id}
                    />
                </View>
            </View>
        )
    }

}