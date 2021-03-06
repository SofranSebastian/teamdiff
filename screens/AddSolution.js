import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton, TextInput, Button, HelperText } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../db/firebaseDB';
import { arrayUnion, doc, updateDoc, getDoc, collection, query, where, getDocs } from '@firebase/firestore';

export default class AddSolution extends React.Component {
    constructor() {
        super();

        this.titleErrorMessage = "";
        this.categoryErrorMessage = "";
        this.descriptionErrorMessage = "";
        this.pointsErrorMessage = "";
        this.userID = "";
        this.username = "";

        this.state = {
            descriptionFromInput: "",
            errorFromDescriptionInput: false,
        };
    }

    async getIDfromAsyncStorage() {
        try {
          const id = await AsyncStorage.getItem('userID');
          const username = await AsyncStorage.getItem('userName');

          if (id !== null) {
            this.userID = id;
          }

          if (username !== null) {
            this.userName = username;
          }

        } catch (e) {
          console.log(e)
        }
    }

    checkDescription = (description) => {
        if (description.length === 0) {
            this.descriptionErrorMessage = "The description is empty.";
            this.setState({errorFromDescriptionInput: true});
            return false;
        }
        else if (description.length > 500) {
            this.setState({errorFromDescriptionInput: true});
            this.descriptionErrorMessage = "The description is too long (max. 500 characters).";
            return false;
        }
        else if (description.length <= 500) {
            this.setState({errorFromDescriptionInput: false});
            return true;
        }
    }

    postBug = async () => {

        const q = query(collection(db, "users"), where("username", "==", this.props.route.params.creatorName));
        const querySnapshot = await getDocs(q);
        let id = "";
        querySnapshot.forEach((doc) => {
            id = doc.id
        });


                    if (this.checkDescription(this.state.descriptionFromInput)) {

                        await this.getIDfromAsyncStorage();

                        let newSolution = {
                            description: this.state.descriptionFromInput,
                            createdAt: Date.now(),
                            ownerID: this.userID,
                            ownerUsername: this.userName,
                            isBest: false
                        };
                        
                        const userRef = doc(db, "users", this.userID);
                        const userSnap = await getDoc(userRef);
 
                        const bugRef = doc(db, "bugs", this.props.route.params.bugID);
                        const bugSnap = await getDoc(bugRef)

                        const notifRef = doc(db, "users", id)
                        const notif = await getDoc(notifRef)

                        await updateDoc( bugRef, {
                            responsesThread: arrayUnion(newSolution)
                        })

                        let newNotification = {
                            message: 'You have a new solution for the ' + this.props.route.params.screenTitle + ' bug.',
                            timestamp: Date.now(),
                            isRead: false
                        }

                        await updateDoc( notifRef, {
                            notifications: arrayUnion(newNotification)
                        })

                        this.props.navigation.reset({
                            index: 0,
                            routes: [{ name: "BugDetail", params:{ 
                                                                    screenTitle: this.props.route.params.screenTitle,
                                                                    bugDetail: this.props.route.params.bugDetail,
                                                                    bugPoints: this.props.route.params.bugPoints,
                                                                    id: this.props.route.params.bugID,
                                                                    creatorName: this.props.route.params.creatorName,
                                                                    image:this.props.route.params.image
                                                                }
                            }]
                        })    
                    }
    }

    render() {
        return(
            <View style={ {flex: 1, backgroundColor: 'white'} }> 
                <IconButton
                    icon='chevron-left'
                    style={ {flex: 0.1, position: 'absolute', marginTop: 40, zIndex: 1} }
                    size={ 35 }
                    onPress={ () => this.props.navigation.navigate("BugDetail", { 
                                        screenTitle: this.props.route.params.screenTitle,
                                        bugDetail: this.props.route.params.bugDetail,
                                        bugPoints: this.props.route.params.bugPoints,
                                        bugID: this.props.route.params.bugID,
                                        creatorName: this.props.route.params.creatorName,
                                    }) 
                    }
                />
                
                <Text style={ {flex: 0.1, fontWeight: 'bold', textAlign: 'center', fontSize: 20, marginTop: 50, color: "#262731", marginBottom: 10} }>
                    ADD SOLUTION
                </Text>

                <KeyboardAwareScrollView style={ {flex: 0.7} }>
                    <View style={ {marginLeft: 20, marginRight: 20} }>
                        <Text style={ {fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: "#262731"} }>
                            SOLUTION
                        </Text>
                        <TextInput
                            style={ {backgroundColor: 'white'} }
                            underlineColor='#262731'
                            activeUnderlineColor='#262731'
                            multiline={ true }
                            placeholder="Bug Solution"
                            onChangeText={ bugS => this.setState({descriptionFromInput: bugS}) }
                        />
                        <HelperText  type="error" visible={ this.state.errorFromDescriptionInput } style={{width:'90%'}}>
                            { this.descriptionErrorMessage }
                        </HelperText>
                    </View>
                </KeyboardAwareScrollView>
                    <Button 
                    style={ {backgroundColor: "#262731", marginTop: "5%", marginBottom:"5%", width:"40%", height: 40, alignSelf: 'center'} }
                    theme={ {roundness: 20} }
                    mode="contained"
                    onPress = { this.postBug }
                    >
                        POST SOLUTION
                    </Button>
            </View>   
        )
    }
}

const styles = StyleSheet.create({
    chipStyle: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#262731",
        marginHorizontal: "1%",
        marginVertical: "1%"
    },
    chipStylePressed: {
        backgroundColor: "#262731",
        borderWidth: 1,
        borderColor: "#262731",
        marginHorizontal: "1%",
        marginVertical: "1%"
    }
});