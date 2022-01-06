import React from "react";
import { Text, View, SafeAreaView, FlatList } from 'react-native';
import { IconButton } from 'react-native-paper';
import { db } from "../db/firebaseDB";
import { bugsCol, usersCol } from "../db/firebaseDB";
import { getDocs, query, orderBy, doc, getDoc, onSnapshot } from "firebase/firestore";
import CardNews from "../components/CardNews";
import CardBugs from "../components/CardBugs";
import BottomTabNavigator from "../components/BottomTabNavigator";
import AsyncStorage from '@react-native-async-storage/async-storage';


const dummyData = require('../dummyDataNews.json')
export default class Home extends React.Component {
    constructor() {
        super();
    
        this.bugsFromFirestore = [];
        this.data = [];
        this.userID = "";

        this.state = {
          stateBugsArray: [],
          refresh: false,
          newNotifications: false
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

    async getBugs(){
      await this.getIDfromAsyncStorage();
      const q = query( bugsCol, orderBy("createdAt","desc"))
      const querySnapshot = await getDocs(q);
      this.bugsFromFirestore = [];
      querySnapshot.forEach((bug) => {
        var bugFromFirestore = bug.data();
        bugFromFirestore.id = bug.id;
        this.bugsFromFirestore.push(bugFromFirestore);
      });
    }

    async getNotifications(){
      await this.getIDfromAsyncStorage();

      const userRef = doc(db, "users", this.userID);
      const user = await getDoc(userRef);

      if( user.exists() ){
        for( let i = 0 ; i < user.data().notifications.length ; i++ ){
          if( user.data().notifications[i].isRead === false ){
            this.setState({
              newNotifications:true
            })
          }
        }
      }

      const unsub = onSnapshot(doc(db, "users", this.userID), (user) => {
          if( user.exists() ){
            for( let i = 0 ; i < user.data().notifications.length ; i++ ){
              if( user.data().notifications[i].isRead === false ){
                this.setState({
                  newNotifications:true
                })
              }
            }
          }
      });
    }

    async componentDidMount(){
        await fetch(  "https://current-news.p.rapidapi.com/news/technology", {
                "method": "GET",
                "headers": {
                    "x-rapidapi-host": "current-news.p.rapidapi.com",
                    "x-rapidapi-key": "baf44d4290msh54dc398cb97add8p194c17jsn9aab1e258a32"
                }
            })
            .then( 
                (response) => response.json()
            ).then( (responseData) => {
                    this.data = responseData.news
                }
            )
            .catch(err => {
                console.error(err);
            });
        //this.data = dummyData.news;

        // for( var i in dummyData.news.length){
        //     this.data.push( dummyData.news[i] );
        // }
        // console.log(this.data);
    
        await this.getNotifications();
        await this.getBugs();
        //this.data = dummyData.news;
        this.setState({ stateBugsArray: this.bugsFromFirestore })
    }

    checkIfItIsMyBug( ownerID ){

      if( this.userID === ownerID ){
        return true;
      }

      return false;

    }

    async _onRefresh(){
      this.setState({refresh: true});
      await this.getBugs();
      this.setState({ stateBugsArray: this.bugsFromFirestore });
      this.setState({refresh:false});
    }


    render() {
        return (
                <SafeAreaView style={{ flex:1, backgroundColor:'white' }}>
                    <View style={{ flex:0.43 }}>
                      <View style={{flexDirection:'row',alignItems:'center', justifyContent:'space-between'}}>
                        <Text style={{ marginLeft:5, marginBottom:5, marginTop:'15%',fontSize:20, fontFamily:'normal-font', fontWeight:'bold', color:"#262731" }}>🧑🏻‍💻 WELCOME TO STACKLY </Text>
                        <View style={{flex:1, alignItems:'flex-end', marginTop:'13%'}}>
                          <IconButton
                            icon="logout"
                            size={20}
                            onPress={() => this.props.navigation.navigate("LogIn")}
                          />
                        </View>
                      </View>
                      <View style={{backgroundColor:"#262731", marginLeft:5, marginBottom:5, marginTop:10, alignSelf:'flex-start', borderRadius:20}}>
                        <Text style={{  paddingHorizontal:10, paddingVertical:5, fontSize:10, fontFamily:'normal-font', fontWeight:'bold', color:"white" }}>📰    TECH NEWS</Text>
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
                    </View>
                    <View style={{backgroundColor:"#262731", marginLeft:5, marginBottom:5, alignSelf:'flex-start', borderRadius:20}}>
                      <Text style={{  paddingHorizontal:10, paddingVertical:5, fontSize:10, fontFamily:'normal-font', fontWeight:'bold', color:"white" }}>☠️   BUGS TO BE KILLED</Text>
                    </View>
                    <View style={{flex:0.45}}>
                        { this.state.stateBugsArray.length === 0 ? 
                          <Text style={{  paddingHorizontal:10, paddingVertical:5, fontSize:12, fontFamily:'normal-font', color:"gray" }}>
                            No bugs yet.
                          </Text>
                        :
                          null
                        }
                        <FlatList   scrollEnabled={ true }
                                    data={ this.state.stateBugsArray }
                                    renderItem={ ({item}) => <CardBugs  title={ item.title }
                                                                        cost={ item.cost }
                                                                        description={ item.description }
                                                                        navigation={ this.props.navigation }
                                                                        category={ item.category }
                                                                        needToSeeIfItIsResolved={ false }
                                                                        isMyBug={ this.checkIfItIsMyBug(item.ownerID) }
                                                                        id = { item.id }
                                                                        image = { item.imageURI}
                                                            /> 
                                            }
                                    refreshing={this.state.refresh}
                                    onRefresh={()=> this._onRefresh()}
                                    keyExtractor={ item => item.id}
                          />
                      </View>
                    <BottomTabNavigator navigation={this.props.navigation} newNotifications={this.state.newNotifications}/>
                </SafeAreaView> 
        )   
    }
}