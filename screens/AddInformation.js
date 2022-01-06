import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton, TextInput, Button, HelperText } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../db/firebaseDB';
import { arrayUnion, doc, updateDoc, getDoc } from '@firebase/firestore';

export default class AddInformation extends React.Component {
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

                        console.log(newSolution);
                        await updateDoc( bugRef, {
                            responsesThread: arrayUnion(newSolution)
                        })

                        this.props.navigation.reset({
                            index: 0,
                            routes: [{ name: "BugDetail", params:{ 
                                                                    screenTitle: this.props.route.params.screenTitle,
                                                                    bugDetail: this.props.route.params.bugDetail,
                                                                    bugPoints: this.props.route.params.bugPoints,
                                                                    id: this.props.route.params.bugID,
                                                                    creatorName: this.props.route.params.creatorName,
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
                    ADD INFORMATION
                </Text>

                <KeyboardAwareScrollView style={ {flex: 0.7} }>
                    <View style={ {marginLeft: 20, marginRight: 20} }>
                        <Text style={ {fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: "#262731"} }>
                            INFORMATION
                        </Text>
                        <TextInput
                            style={ {backgroundColor: 'white'} }
                            underlineColor='#262731'
                            activeUnderlineColor='#262731'
                            multiline={ true }
                            placeholder="New informations for the bug"
                            onChangeText={ bugS => this.setState({descriptionFromInput: bugS}) }
                        />
                        <HelperText  type="error" visible={ this.state.errorFromDescriptionInput } style={{width:'90%'}}>
                            { this.descriptionErrorMessage }
                        </HelperText>
                    </View>
                </KeyboardAwareScrollView>
                    <Button 
                    style={ {backgroundColor: "#262731", marginTop: "5%", marginBottom:"5%", width:"50%", height: 40, alignSelf: 'center'} }
                    theme={ {roundness: 20} }
                    mode="contained"
                    onPress = { this.postBug }
                    >
                        POST INFORMATION
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