import React from 'react';
import { View, Text, Picker } from 'react-native';
import { IconButton, TextInput, Button, HelperText } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bugsCol, db } from '../db/firebaseDB';
import { addDoc, arrayUnion, doc, increment, updateDoc, getDoc } from '@firebase/firestore';

export default class AddBug extends React.Component {
    constructor() {
        super();
        this.titleErrorMessage = "";
        this.categoryErrorMessage = "";
        this.descriptionErrorMessage = "";
        this.pointsErrormessage = "";

        this.state = {
            selectedCategory: "-",
            selectedPoints: "-",
            descriptionFromInput: "",
            titleFromInput: "",
            errorFromTitleInput: false,
            errorFromCategoryInput: false,
            errorFromDescriptionInput: false,
            errorFromPointsInput: false
        };
    }

    async getIDfromAsyncStorage() {
        try {
          const value = await AsyncStorage.getItem('userID')
          if (value !== null) {
            this.userID = value;
          }
        } catch (e) {
          // error reading value
        }
    }

    checkTitle = (title) => {
        if (title.length === 0) {
            this.titleErrorMessage = "Please input the title.";
            this.setState({errorFromTitleInput: true});
            console.log("The title is empty!");
            return false;
        }
        else if (title.length > 25) {
            this.titleErrorMessage = "The title is too long.";
            this.setState({errorFromTitleInput: true});
            console.log("The title is too long.");
            return false;
        }
        else if (title.length <= 25) {
            this.setState({errorFromTitleInput: false});
            console.log("The title is fine.");
            return true;
        }
    }

    checkCategory = (category) => {
        if (category === "-") {
            this.categoryErrorMessage = "Please select a category.";
            this.setState({errorFromCategoryInput: true});
            return false;
        }
        this.setState({errorFromCategoryInput: false});
        return true;
    }

    checkDescription = (description) => {
        if (description.length === 0) {
            this.descriptionErrorMessage = "The description is empty.";
            this.setState({errorFromDescriptionInput: true});
            return false;
        }
        else if (description.length > 250) {
            this.setState({errorFromDescriptionInput: true});
            this.descriptionErrorMessage = "The description is too long.";
            console.log("The description is too long.");
            return false;
        }
        else if (description.length <= 250) {
            this.setState({errorFromDescriptionInput: false});
            console.log("The description is fine.");
            return true;
        }
    }

    checkPoints = (points) => {
        if (points === "-") {
            this.pointsErrorMessage = "Please select a number of bug points.";
            this.setState({errorFromPointsInput: true});
            return false;
        }
        this.setState({errorFromPointsInput: false});
        return true;
    }

    postBug = async () => {
        if (this.checkTitle(this.state.titleFromInput)) {
            if (this.checkCategory(this.state.selectedCategory)) {
                if (this.checkDescription(this.state.descriptionFromInput)) {
                    if (this.checkPoints(this.state.selectedPoints)) {

                        await this.getIDfromAsyncStorage();
                        console.log(this.userID);

                        let newBug = {
                            title: this.state.titleFromInput,
                            category: this.state.selectedCategory,
                            description: this.state.descriptionFromInput,
                            cost: Number(this.state.selectedPoints),
                            helpers: Array(),
                            responsesThread: Array(),
                            createdAt: Date.now(),
                            ownerID: this.userID
                        };

                        // let date = new Date(newBug.createdAt);

                        // if (date.getTimezoneOffset() < 0) {
                        //     date.setHours(date.getHours() + Math.abs(date.getTimezoneOffset() / 60));
                        // }
                        // else {
                        //     date.setHours(date.getHours() - Math.abs(date.getTimezoneOffset() / 60));
                        // }
                        // console.log(date);
                        

                        
                        const userRef = doc(db, "users", this.userID);
                        const userSnap = await getDoc(userRef);
 
                        let userPoints = userSnap.data().bugsScore;
 
                        if (userPoints >= this.state.selectedPoints) {
                            
                            const bugRef = await addDoc(bugsCol, newBug);
                            
                            await updateDoc(userRef, {
                                bugsScore: increment(-Number(this.state.selectedPoints)),
                                bugsAsked: increment(1),
                                bugs: arrayUnion(bugRef.id)
                            });
    

                            this.props.navigation.reset({
                                index: 0,
                                routes: [{ name: 'Home' }]
                           });
                        }
                        else {
                            this.pointsErrorMessage = `Too much. Your available bug points: ${userPoints}`;
                            this.setState({errorFromPointsInput: true});
                        }
                    }
                }
            }
        }
    }

    render() {
        return(
            <View style={ {flex: 1, backgroundColor: 'white'} }>
                <IconButton
                    icon='chevron-left'
                    style={ {flex: 0.1, position: 'absolute', marginTop: 40, zIndex: 1} }
                    size={35} 
                    onPress={ () => this.props.navigation.navigate("Home") }
                />

                <Text style={ {flex: 0.1, fontWeight: 'bold', textAlign: 'center', fontSize: 20, marginTop: 50, color: "#262731", marginBottom: 10} }>
                    ADD BUG
                </Text>

                <KeyboardAwareScrollView style={ {flex: 0.7} }>
                    <View style={ {marginLeft: 20, marginRight: 20} }>
                        <Text style={ {fontSize: 18, fontWeight: 'bold', marginBottom: 5, marginTop: 10} }>
                            TITLE
                        </Text>
                        <TextInput
                            style={ {backgroundColor: 'white'} }
                            underlineColor='#262731'
                            activeUnderlineColor='#262731'
                            placeholder='Bug Title'
                            left={ <TextInput.Icon icon="text-short" size={20}/> }
                            onChangeText={ title => this.setState({titleFromInput: title}) } 
                        />
                        <HelperText  type="error" visible={ this.state.errorFromTitleInput } style={{width:'90%'}}>
                            { this.titleErrorMessage }
                        </HelperText>
                        <Text style={ {fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: "#262731"} }>
                            CATEGORY
                        </Text>
                        <View style={ { borderWidth: 1.7, borderRadius: 3000000, borderColor: "#262731"} }>
                            <Picker
                                selectedValue={ this.state.selectedCategory }
                                onValueChange={ (category) => this.setState({selectedCategory: category}) }
                            >
                                <Picker.Item label='-' value='-'/>
                                <Picker.Item label='JavaScript' value='JavaScript'/>
                                <Picker.Item label='C' value='C'/>
                                <Picker.Item label='Java' value='Java'/>
                            </Picker>
                        </View>
                        <HelperText  type="error" visible={ this.state.errorFromCategoryInput } style={{width:'90%'}}>
                            { this.categoryErrorMessage }
                        </HelperText>
                        <Text style={ {fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: "#262731"} }>
                            DESCRIPTION
                        </Text>
                        <TextInput
                            style={ {backgroundColor: 'white'} }
                            underlineColor='#262731'
                            activeUnderlineColor='#262731'
                            multiline={ true }
                            placeholder="Bug Description"
                            onChangeText={ bugD => this.setState({descriptionFromInput: bugD}) }
                        />
                        <HelperText  type="error" visible={ this.state.errorFromDescriptionInput } style={{width:'90%'}}>
                            { this.descriptionErrorMessage }
                        </HelperText>
                        <Text style={ {fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: "#262731"} }>
                            BUG POINTS
                        </Text>
                        <View style={ { borderWidth: 1.7, borderRadius: 30, borderColor: "#262731"} }>
                            <Picker
                                selectedValue={ this.state.selectedPoints }
                                onValueChange={ (points) => this.setState({selectedPoints: points}) }
                            >
                                <Picker.Item label='-' value='-'/>
                                <Picker.Item label='15' value='15'/>
                                <Picker.Item label='25' value='25'/>
                                <Picker.Item label='30' value='30'/>
                                <Picker.Item label='50' value='50'/>
                                <Picker.Item label='100' value='100'/>
                            </Picker>
                        </View>
                        <HelperText  type="error" visible={ this.state.errorFromPointsInput } style={{width:'90%'}}>
                            { this.pointsErrorMessage }
                        </HelperText>
                    </View>
                </KeyboardAwareScrollView>
                <Button 
                    style={ {backgroundColor: "#262731", marginTop: "5%", marginBottom:"5%", width:"40%", height: 40, alignSelf: 'center'} }
                    theme={ {roundness: 20} }
                    mode="contained"
                    onPress = { async () => this.postBug() }
                >
                    POST BUG
                </Button>
            </View>
        )
    }
}