import React from "react";
import { FlatList, useWindowDimensions, TouchableOpacity, StyleSheet, Text, View, Image, ScrollView, StatusBar } from 'react-native';
import { TextInput, Button, IconButton, HelperText, Avatar } from 'react-native-paper';
import { db, bugsCol } from "../db/firebaseDB";
import { doc, getDocs, onSnapshot, query, where, getDoc } from "firebase/firestore";
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Swiper from 'react-native-swiper';
import CardBugs from "../components/CardBugs";
export default class BugDetail extends React.Component {

    constructor(){
        super()

        this.state={
            index: 0,
            responsesFromFirestore: [],
        }
    }

    async getResponses(){
        const bugRef = doc(db, "bugs", this.props.route.params.id);
        const bug = await getDoc(bugRef);
        
        if (bug.exists()) {
            var tempArray = []
            for( let i = 0 ; i < bug.data().responsesThread.length ; i++ ){
                var objectResponse = {
                    helper: bug.data().helpers[i],
                    response: bug.data().responsesThread[i]
                }
                tempArray.push(objectResponse);
            }
            this.setState({ responsesFromFirestore: tempArray})
        } else {
          console.log("No such document!");
        }
    }

    async componentDidMount(){
        
        await this.getResponses();
        console.log(this.state.responsesFromFirestore)
    }

    render() {
  
        return (

          <ParallaxScrollView
          backgroundColor="#262731"
          contentBackgroundColor="white"
          parallaxHeaderHeight={300}
          renderForeground={() => (
                <View style={{ height: 300, flex: 1}}>
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
                                BUG INFORMATION
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
                                BUG RESPONSES
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
                                {/* <Text>{this.props.route.params.bugPoints}</Text>
                                <Text>{ this.props.route.params.isMyBug === true ? "is my bug" : "is not my bug"}</Text> */}
                            </View>
                            <View style={{backgroundColor:"#262731", marginLeft:5, marginTop:15, marginBottom:5, alignSelf:'flex-start', borderRadius:20}}>
                                <Text style={{  paddingHorizontal:10, paddingVertical:5, fontSize:10, fontFamily:'normal-font', fontWeight:'bold', color:"white" }}>🏆  BUG PRIZE</Text>
                            </View>
                             <View style={{ marginHorizontal:10, alignItems:'center', marginTop: 5}}>
                                <Text style={{ fontSize:40, fontFamily:'normal-font', fontWeight:'bold', color:"#262731"}}>
                                    { "🪙" }
                                </Text>
                                <Text style={{ fontSize:24, fontFamily:'normal-font',  color:"#262731"}}>
                                    {  this.props.route.params.bugPoints + "p" }
                                </Text>
                            </View>
                            <View style={{backgroundColor:"#262731", marginLeft:5, marginTop:15, marginBottom:5, alignSelf:'flex-start', borderRadius:20}}>
                                <Text style={{  paddingHorizontal:10, paddingVertical:5, fontSize:10, fontFamily:'normal-font', fontWeight:'bold', color:"white" }}>👤  BUG CREATOR</Text>
                            </View>
                        </View>
                    :
                    <View>
                        <FlatList   scrollEnabled={ true }
                                    data={ this.state.responsesFromFirestore }
                                    renderItem={ ({item}) => <CardBugs  title={ item.helper }
                                                                        description={ item.response }
                                                            /> 
                                            }
                                    keyExtractor={ item => item.response}
                                    />
                    </View>
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