import React from "react";
import { Text, View, ImageBackground, SafeAreaView, FlatList, ScrollView, StatusBar } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { bugsCol } from "../db/firebaseDB";
import { doc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import CardNews from "../components/CardNews";
import CardBugs from "../components/CardBugs";
import BottomTabNavigator from "../components/BottomTabNavigator";

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
    
        this.bugsFromFirestore = [];
        this.data = dummyData.news;
        //console.log(this.data);

        this.state = {
          stateBugsArray: [],
        }
    }

    async getBugs(){
      const querySnapshot = await getDocs(bugsCol);
      querySnapshot.forEach((bug) => {
        var bugFromFirestore = bug.data()
        bugFromFirestore.id = bug.id
        this.bugsFromFirestore.push(bugFromFirestore)
      });

      // const q = query(bugsCol, where("isResolved", "==", false));
      // const unsubscribe = onSnapshot(q, (snapshot) => {
      //     snapshot.docChanges().forEach((change) => {
      //       if (change.type === "added") {
      //           console.log("New bug: ", change.doc.data());
      //       }
      //       if (change.type === "modified") {
      //           console.log("Modified bug: ", change.doc.data());
      //       }
      //       if (change.type === "removed") {
      //           var removeIndex = this.state.stateBugsArray.indexOf( change.doc.data().title )
            
      //       }
        
      //   });
      // });
    }

    async componentDidMount(){
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
    
        await this.getBugs();
        this.data = dummyData.news;
        this.setState({ stateBugsArray: this.bugsFromFirestore })
    }


    render() {
        return (
                <SafeAreaView style={{ flex:1, backgroundColor:'white' }}>
                    <View style={{ flex:0.43 }}>
                      <Text style={{ marginLeft:5, marginBottom:5, marginTop:'15%',fontSize:20, fontFamily:'normal-font', fontWeight:'bold', color:"#262731" }}>🧑🏻‍💻 WELCOME TO STACKLY </Text>
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
                      <FlatList   scrollEnabled={ true }
                                  data={ this.state.stateBugsArray }
                                  renderItem={ ({item}) => <CardBugs  title={ item.title }
                                                                      cost={ item.cost }
                                                                      description={ item.description }
                                                                      navigation={ this.props.navigation }
                                                                      category={ item.category }
                                                                      needToSeeIfItIsResolved={ false }
                                                          /> 
                                          }
                                  keyExtractor={ item => item.id}
                        />
                      </View>
                    <BottomTabNavigator navigation={this.props.navigation}/>
                </SafeAreaView> 
        )   
    }
}

