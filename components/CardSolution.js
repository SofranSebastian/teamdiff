import * as React from 'react';
import { Text, View, Image } from 'react-native';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { db } from "../db/firebaseDB";
import { arrayUnion, doc, getDoc, arrayRemove } from "firebase/firestore";
import { collection, query, where, getDocs, updateDoc, increment } from "firebase/firestore";

async function getSolutionOwnerID(props){
    const q = query(collection(db, "users"), where("username", "==", props.ownerUsername));
    const querySnapshot = await getDocs(q);
    
    let id = null;

    querySnapshot.forEach((doc) => {
      id = doc.id
    });

    return id;
}

async function getBugOwnerID(props){
    const q = query(collection(db, "users"), where("username", "==", props.bugCreator));

    const querySnapshot = await getDocs(q);
    
    let id = "";

    querySnapshot.forEach((doc) => {
      id = doc.id
    });

    return id;
}

async function getResponse(props){
    const bugRef = doc(db, "bugs", props.bugID);
    const bug = await getDoc(bugRef);
    
    for( let i = 0 ; i < bug.data().responsesThread.length ; i++ ){
        if( bug.data().responsesThread[i].createdAt === props.timestamp){
                let newResponse = bug.data().responsesThread[i]
                newResponse.isBest = true;
                await updateDoc( bugRef, {
                    responsesThread: arrayRemove(bug.data().responsesThread[i])
                })
                await updateDoc( bugRef, {
                    responsesThread: arrayUnion(newResponse)
                })
        }   
    }
}

async function markResolved(props){
    let userSolutionID = await getSolutionOwnerID(props);
    let userBugID = await getBugOwnerID(props);
    let bugID = props.bugID

    await getResponse(props)
    const userRef = doc(db, "users", userSolutionID);
    await updateDoc(userRef, {
        bugsScore: increment(+Number(props.bugPoints)),
        bugsFixed: increment(1),
    });

    const bugRef = doc(db, "bugs", bugID)
    await updateDoc(bugRef, {
        isResolved:true
    });  


    const notifRef = doc(db,'users',userSolutionID)
    let newNotification = {
        message: 'Your answer for bug ' + props.screenTitle + ' was marked as the best.',
        timestamp: Date.now(),
        isRead: false
    }

    await updateDoc( notifRef, {
        notifications: arrayUnion(newNotification)
    })

    props.navigation.reset({
        index: 0,
        routes: [{ name: "BugDetail", params:{ 
                                                screenTitle: props.screenTitle,
                                                bugDetail: props.bugDetail,
                                                bugPoints: props.bugPoints,
                                                id: props.bugID,
                                                creatorName: props.bugCreator,
                                                image: props.image
                                            }
        }]
    }) 
}

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
                    
                    { props.isBest === true ?
                        <View style={{position:'absolute', right:5, top:5}}>
                            <Avatar.Icon size={15} icon="trophy" style={{backgroundColor:"#262731"}}/>
                        </View>
                        :
                        null
                    }
                    <View style={{  flex:0.8, marginTop:'2%'}}>
                        {  props.bugCreator === props.ownerUsername ?
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
                                        disabled = { props.isResolved }
                                        style={{backgroundColor:"#262731"}}
                                        onPress={() => markResolved(props)}
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