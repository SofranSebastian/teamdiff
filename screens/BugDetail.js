import React from "react";
import { FlatList, useWindowDimensions, TouchableOpacity, StyleSheet, Text, View, Image, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { TextInput, Button, IconButton, HelperText, Avatar } from 'react-native-paper';
import { db, bugsCol } from "../db/firebaseDB";
import { doc, getDocs, onSnapshot, query, where, getDoc } from "firebase/firestore";
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Swiper from 'react-native-swiper';
import CardSolution from "../components/CardSolution";
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class BugDetail extends React.Component {

    constructor(){
        super()

        this.state={
            index: 0,
            responsesFromFirestore: [],
            creator: "",
            loggedUser: "",
            timestamp: new Date(),
            bugID: "",
            isAbleToDecide: false,
            isResolved: false
        }  

    }

    async getIDfromAsyncStorage() {
        try {
          const username = await AsyncStorage.getItem('userName');
          
          if (username !== null) {
            this.setState({loggedUser: username});
        
            if( this.props.route.params.creatorName ){
                this.setState({creator: this.props.route.params.creatorName})
            }
          }

        } catch (e) {
          return;
        }
    }

    async getResponses(){
        console.log(this.props.route.params.id)
        const bugRef = doc(db, "bugs", this.props.route.params.id);
        const bug = await getDoc(bugRef);
        
        if (bug.exists()) {
            var tempArray = [];
            this.setState({
                creator:bug.data().ownerUsername,
                timestamp: new Date(bug.data().createdAt),
                bugID: this.props.route.params.id,
                isResolved: bug.data().isResolved
            })

            for( let i = 0 ; i < bug.data().responsesThread.length ; i++ ){
                var objectResponse = bug.data().responsesThread[i]
                tempArray.push(objectResponse);
                console.log('asdasd')
            }
            this.setState({ responsesFromFirestore: tempArray})
        } else {
          console.log("No such document!");
        }
    }

    async componentDidMount(){
        console.log('asdasd1')
        await this.getIDfromAsyncStorage();
        console.log('asdasd2')
        await this.getResponses();
        console.log('asdasd3')
        if( this.state.creator === this.state.loggedUser ){
            this.setState({isAbleToDecide: true})
        }
    }

    addSolutionHandler(){
        this.props.navigation.navigate("AddSolution", { 
            screenTitle: this.props.route.params.screenTitle,
            bugDetail: this.props.route.params.bugDetail,
            bugPoints: this.props.route.params.bugPoints,
            bugID: this.state.bugID,
            creatorName: this.props.route.params.creatorName,
        })
    }

    addInformationHandler(){
        this.props.navigation.navigate("AddInformation", { 
            screenTitle: this.props.route.params.screenTitle,
            bugDetail: this.props.route.params.bugDetail,
            bugPoints: this.props.route.params.bugPoints,
            bugID: this.state.bugID,
            creatorName: this.props.route.params.creatorName,
        })
    }

    render() {
  
        return (

          <ParallaxScrollView
          backgroundColor="#262731"
          contentBackgroundColor="white"
          parallaxHeaderHeight={300}
          renderForeground={() => (
                <View style={{ flex: 1}}>
                    <View style={{flexDirection:'row', alignItems:'center', marginTop:'10%'}}>
                        <IconButton
                            icon="chevron-left"
                            size={20}
                            color={'white'}
                            onPress={() => this.props.navigation.navigate("Home")}
                        />
                        <Text style={{ marginLeft:-10, fontSize:14, fontFamily:'normal-font', fontWeight:'bold', color:"white" }}>
                            BACK
                        </Text>
                    </View>
                    <View style={{marginTop:'5%'}}>
                        <Image source={require('../images/bug_white_icon.png')} style={{marginLeft:10, width:50, height:50}}/>
                        <Text style={{ paddingHorizontal:10, marginVertical:10 ,fontSize:25, fontFamily:'normal-font', fontWeight:'bold', color:"white" }}>
                            {this.props.route.params.screenTitle.toUpperCase()}
                        </Text>
                    </View>
                    <View style={{ marginTop:'10%', flexDirection:'row', justifyContent:"space-around"}}>
                        <TouchableOpacity 
                        onPress={ () => this.setState({index: 0}) }
                        style={
                            this.state.index === 0 ?
                            { backgroundColor:"white", borderRadius:30, width:130, height: 30, justifyContent:'center', alignItems:'center' }
                            :
                            { borderRadius:30, width:130, height: 30, justifyContent:'center', alignItems:'center' }
                        }>
                            <Text style={
                                this.state.index === 0 ? 
                                { paddingHorizontal:10, marginVertical:10 ,fontSize:12, fontFamily:'normal-font', fontWeight:'bold', color:"#262731" }
                                :
                                { paddingHorizontal:10, marginVertical:10 ,fontSize:12, fontFamily:'normal-font', fontWeight:'bold', color:"white" }
                            }>
                                INFORMATION
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        onPress={ () => this.setState({index: 1}) }
                        style={
                            this.state.index === 1 ?
                            { backgroundColor:"white", borderRadius:30, width:130, height: 30, justifyContent:'center', alignItems:'center' }
                            :
                            { borderRadius:30, width:130, height: 30, justifyContent:'center', alignItems:'center' }
                        }>
                            <Text style={
                                this.state.index === 1 ? 
                                { paddingHorizontal:10, marginVertical:10 ,fontSize:12, fontFamily:'normal-font', fontWeight:'bold', color:"#262731" }
                                :
                                { paddingHorizontal:10, marginVertical:10 ,fontSize:12, fontFamily:'normal-font', fontWeight:'bold', color:"white" }
                            }>
                                RESPONSES
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}>
                {
                    this.state.index === 0 ?
                        <View>

                            <View style={{backgroundColor:"#262731", marginLeft:5, marginTop:15, marginBottom:5, alignSelf:'flex-start', borderRadius:20}}>
                                <Text style={{  paddingHorizontal:10, paddingVertical:5, fontSize:10, fontFamily:'normal-font', fontWeight:'bold', color:"white" }}>ℹ️  BUG DESCRIPTION</Text>
                            </View>
                            <View style={{ marginHorizontal:10 }}>
                                <Text style={{ fontSize:16, fontFamily:'normal-font', color:"#262731"}}>
                                    {this.props.route.params.bugDetail}
                                </Text>
                            </View>
                            <View style={{backgroundColor:"#262731", marginLeft:5, marginTop:15, marginBottom:5, alignSelf:'flex-start', borderRadius:20}}>
                                <Text style={{  paddingHorizontal:10, paddingVertical:5, fontSize:10, fontFamily:'normal-font', fontWeight:'bold', color:"white" }}>🏆  BUG PRIZE</Text>
                            </View>
                             <View style={{ marginHorizontal:10, flexDirection:'row', alignItems:"center", marginTop: 5}}>
                                <Text style={{ fontSize:20, fontFamily:'normal-font', fontWeight:'bold', color:"#262731"}}>
                                    { "🪙 " }
                                </Text>
                                <Text style={{ fontSize:16, fontFamily:'normal-font',  color:"#262731"}}>
                                    {  this.props.route.params.bugPoints + "p" }
                                </Text>
                            </View>
                            <View style={{backgroundColor:"#262731", marginLeft:5, marginTop:15, marginBottom:5, alignSelf:'flex-start', borderRadius:20}}>
                                <Text style={{  paddingHorizontal:10, paddingVertical:5, fontSize:10, fontFamily:'normal-font', fontWeight:'bold', color:"white" }}>👤  BUG CREATOR</Text>
                            </View>
                            <View style={{ marginHorizontal:10, marginTop: 5}}>
                                <Text style={{ fontSize:12, fontFamily:'normal-font', color:"#262731"}}>
                                    {"Creatd by " + this.state.creator + " at " + this.state.timestamp.toUTCString()}
                                </Text>
                            </View>
                            <View style={{backgroundColor:"#262731", marginLeft:5, marginTop:15, marginBottom:5, alignSelf:'flex-start', borderRadius:20}}>
                                <Text style={{  paddingHorizontal:10, paddingVertical:5, fontSize:10, fontFamily:'normal-font', fontWeight:'bold', color:"white" }}>📷  BUG IMAGES</Text>
                            </View>

                        </View>
                    :
                    <SafeAreaView>
                        <View style={{ alignItems:'center', width:'100%'}}>
                            { this.state.creator === this.state.loggedUser ?
                                <View style={{width:"100%", alignItems:'center'}}>
                                    <Button style={{backgroundColor:"#262731", marginVertical:"5%", width:"50%", height: 40}}
                                            theme={{ roundness: 20 }}
                                            mode="contained"
                                            onPress={ () => this.addInformationHandler()}
                                    >
                                        ADD INFORMATIONS
                                    </Button>
                                    <Text style={{width:'80%', marginHorizontal:'10%', textAlign:'center',fontSize:10, fontFamily:'normal-font', fontWeight:'bold', color:"gray" }}>
                                        Don't forget to mark a solution by pressing the star icon on the solution that helped you to kill the bug
                                    </Text>
                                </View>
                            :

                                <Button style={{backgroundColor:"#262731", marginVertical:"5%", width:"40%", height: 40}}
                                        theme={{ roundness: 20 }}
                                        mode="contained"
                                        onPress={ () => this.addSolutionHandler()}
                                >
                                    ADD SOLUTION
                                </Button>
                            }
                        </View>
                        <ScrollView>

                                    { this.state.responsesFromFirestore.map( (item) => 
                                        <CardSolution   key={ item.description }
                                                        ownerUsername={ item.ownerUsername }
                                                        timestamp={ item.createdAt }
                                                        description={ item.description }
                                                        isAbleToDecide= { this.state.isAbleToDecide }
                                                        loggedUsername= { this.state.loggedUser }
                                                        bugCreator = { this.state.creator }
                                                        bugID = { this.props.route.params.id }
                                                        bugPoints = { this.props.route.params.bugPoints }
                                                        isResolved = { this.state.isResolved }
                                        /> 
                                    )}
                        </ScrollView>
                    </SafeAreaView>
                }
            </ParallaxScrollView>
          )
    }
}
const styles = StyleSheet.create({
    wrapper: {},
    slide1: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#9DD6EB'
    },
    slide2: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#97CAE5'
    },
    slide3: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#92BBD9'
    },
    text: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold'
    }
  })