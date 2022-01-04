import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { IconButton, TextInput, Button, HelperText, Chip, Avatar} from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bugsCol, db } from '../db/firebaseDB';
import { addDoc, arrayUnion, doc, increment, updateDoc, getDoc } from '@firebase/firestore';
import { Camera } from 'expo-camera';
import { getStorage, ref, uploadBytes, uploadString, uploadBytesResumable, getDownloadURL  } from "firebase/storage";
import * as FileSystem from 'expo-file-system';
import * as Progress from 'react-native-progress';
export default class AddBug extends React.Component {
    constructor() {
        super();

        this.titleErrorMessage = "";
        this.categoryErrorMessage = "";
        this.descriptionErrorMessage = "";
        this.pointsErrorMessage = "";
        this.userID = "";
        this.username = "";

        this.state = {
            selectedCategoryColor: ["#262731", "#262731", "#262731", "#262731", "#262731", "#262731"],
            isSelectedCategory: [false, false, false, false, false, false],
            selectedPointsColor: ["#262731", "#262731", "#262731", "#262731", "#262731", "#262731"],
            isSelectedPoints: [false, false, false, false, false, false],
            selectedCategory: null,
            selectedPoints: null,
            descriptionFromInput: "",
            titleFromInput: "",
            errorFromTitleInput: false,
            errorFromCategoryInput: false,
            errorFromDescriptionInput: false,
            errorFromPointsInput: false,
            cameraType: Camera.Constants.Type.back,
            isCameraOn: false,
            uploadProgress: 0
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
            this.titleErrorMessage = "The title is too long (max. 25 characters).";
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
        if (category === null) {
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
            this.descriptionErrorMessage = "The description is too long (max. 250 characters).";
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
        if (points === null) {
            this.pointsErrorMessage = "Please select a number of bug points.";
            this.setState({errorFromPointsInput: true});
            return false;
        }
        this.setState({errorFromPointsInput: false});
        return true;
    }

    componentDidMount(){

    }

    dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type:mime});
        }

        urlToObject= async(location)=> {
            const response = await fetch(location);
            // here image is url/location of image
            const blob = await response.blob();
            const file = new File([blob], 'image.jpg', {type: blob.type});
            console.log(file);
          }

    postBug = async () => {

        if( this.props.route.params.image.uri !== null){
            let downloadBugURL = ''
            let blob = await fetch(this.props.route.params.image.uri).then(r => r.blob());
            console.log(blob)
            let metadata = {
            type: 'image/jpeg'
            };
            let file = new File([blob], "test.jpg", metadata);
            console.log(file)
            const storage = getStorage();
            const bugRef = ref(storage, 'images/' + new Date().toISOString());
            const uploadTask = uploadBytesResumable(bugRef, file, metadata);
            uploadTask.on('state_changed',
            (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes);
            this.setState({uploadProgress:progress})
            switch (snapshot.state) {
                case 'paused':
                console.log('Upload is paused');
                break;
                case 'running':
                console.log('Upload is running');
                break;
            }
            }, 
            (error) => {
            switch (error.code) {
                case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
                case 'storage/canceled':
                // User canceled the upload
                break;
                case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
            }, 
            () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
                console.log('File available at', downloadURL);
                downloadBugURL = downloadURL;
                if (this.checkTitle(this.state.titleFromInput)) {
                    if (this.checkCategory(this.state.selectedCategory)) {
                        if (this.checkDescription(this.state.descriptionFromInput)) {
                            if (this.checkPoints(this.state.selectedPoints)) {
        
                                await this.getIDfromAsyncStorage();
        
                                let newBug = {
                                    title: this.state.titleFromInput,
                                    category: this.state.selectedCategory,
                                    description: this.state.descriptionFromInput,
                                    cost: Number(this.state.selectedPoints),
                                    helpers: Array(),
                                    responsesThread: Array(),
                                    createdAt: Date.now(),
                                    ownerID: this.userID,
                                    ownerUsername: this.userName,
                                    isResolved: false,
                                    imageURI: downloadBugURL
                                };

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
            });
            }
        );
        }else{
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
                                ownerID: this.userID,
                                ownerUsername: this.userName,
                                isResolved: false,
                                imageURI: ""
                            };
                            
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

        
    }

    render() {
        return(
            <View style={ {flex: 1, backgroundColor: 'white'} }>                       
                <IconButton
                    icon='chevron-left'
                    style={ {flex: 0.1, position: 'absolute', marginTop: 40, zIndex: 1} }
                    size={ 35 }
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
                        <View style={{flexDirection: 'row', flexWrap:'wrap'}}>
                            <Chip
                                style={ this.state.isSelectedCategory[0] === false ? styles.chipStyle : styles.chipStylePressed }
                                onPress={() => this.setState(
                                    {
                                        isSelectedCategory: [true, false, false, false, false, false],
                                        selectedCategory: "JavaScript",
                                        selectedCategoryColor: ["white", "#262731", "#262731", "#262731", "#262731", "#262731"]
                                    },
                                    console.log("JavaScript")
                                )
                                }
                                selectedColor={this.state.selectedCategoryColor[0]}>
                                JavaScript
                            </Chip>
                            <Chip
                                style={ this.state.isSelectedCategory[1] === false ? styles.chipStyle : styles.chipStylePressed }
                                onPress={() => this.setState(
                                    {
                                        isSelectedCategory: [false, true, false, false, false, false], 
                                        selectedCategory: "Java", 
                                        selectedCategoryColor: ["#262731", "white", "#262731", "#262731", "#262731", "#262731"]
                                    },
                                    console.log("Java")
                                )}
                                selectedColor={this.state.selectedCategoryColor[1]}>
                                Java
                            </Chip>
                            <Chip
                                style={ this.state.isSelectedCategory[2] === false ? styles.chipStyle : styles.chipStylePressed }
                                onPress={() => this.setState(
                                    {
                                        isSelectedCategory: [false, false, true, false, false, false], 
                                        selectedCategory: "C", 
                                        selectedCategoryColor: ["#262731", "#262731", "white", "#262731", "#262731", "#262731"]
                                    },
                                    console.log("C")
                                )}
                                selectedColor={this.state.selectedCategoryColor[2]}>
                                C
                            </Chip>
                            <Chip
                                style={ this.state.isSelectedCategory[3] === false ? styles.chipStyle : styles.chipStylePressed }
                                onPress={() => this.setState(
                                    {
                                        isSelectedCategory: [false, false, false, true, false, false], 
                                        selectedCategory: "Python", 
                                        selectedCategoryColor: ["#262731", "#262731", "#262731",  "white", "#262731", "#262731"]
                                    },
                                    console.log("Python")
                                )}
                                selectedColor={this.state.selectedCategoryColor[3]}>
                                Python
                            </Chip>
                            <Chip
                                style={ this.state.isSelectedCategory[4] === false ? styles.chipStyle : styles.chipStylePressed }
                                onPress={() => this.setState(
                                    {
                                        isSelectedCategory: [false, false, false, false, true, false], 
                                        selectedCategory: "Scala", 
                                        selectedCategoryColor: ["#262731", "#262731", "#262731", "#262731", "white", "#262731"]
                                    },
                                    console.log("Scala")
                                )}
                                selectedColor={this.state.selectedCategoryColor[4]}>
                                Scala
                            </Chip>
                            <Chip
                                style={ this.state.isSelectedCategory[5] === false ? styles.chipStyle : styles.chipStylePressed }
                                onPress={() => this.setState(
                                    {
                                        isSelectedCategory: [false, false, false, false, false, true], 
                                        selectedCategory: "C++", 
                                        selectedCategoryColor: ["#262731", "#262731", "#262731", "#262731", "#262731", "white"]
                                    },
                                    console.log("C++")
                                )}
                                selectedColor={this.state.selectedCategoryColor[5]}>
                                C++
                            </Chip>
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
                        <View style={{flexDirection: 'row', flexWrap:'wrap'}}>
                            <Chip
                                style={ this.state.isSelectedPoints[0] === false ? styles.chipStyle : styles.chipStylePressed }
                                onPress={() => this.setState(
                                    {
                                        isSelectedPoints: [true, false, false, false, false, false],
                                        selectedPoints: "5",
                                        selectedPointsColor: ["white", "#262731", "#262731", "#262731", "#262731", "#262731"]
                                    },
                                    console.log("5")
                                )
                                }
                                selectedColor={this.state.selectedPointsColor[0]}>
                                5
                            </Chip>
                            <Chip
                                style={ this.state.isSelectedPoints[1] === false ? styles.chipStyle : styles.chipStylePressed }
                                onPress={() => this.setState(
                                    {
                                        isSelectedPoints: [false, true, false, false, false, false], 
                                        selectedPoints: "20", 
                                        selectedPointsColor: ["#262731", "white", "#262731", "#262731", "#262731", "#262731"]
                                    },
                                    console.log("20")
                                )}
                                selectedColor={this.state.selectedPointsColor[1]}>
                                20
                            </Chip>
                            <Chip
                                style={ this.state.isSelectedPoints[2] === false ? styles.chipStyle : styles.chipStylePressed }
                                onPress={() => this.setState(
                                    {
                                        isSelectedPoints: [false, false, true, false, false, false], 
                                        selectedPoints: "40", 
                                        selectedPointsColor: ["#262731", "#262731", "white", "#262731", "#262731", "#262731"]
                                    },
                                    console.log("40")
                                )}
                                selectedColor={this.state.selectedPointsColor[2]}>
                                40
                            </Chip>
                            <Chip
                                style={ this.state.isSelectedPoints[3] === false ? styles.chipStyle : styles.chipStylePressed }
                                onPress={() => this.setState(
                                    {
                                        isSelectedPoints: [false, false, false, true, false, false], 
                                        selectedPoints: "60", 
                                        selectedPointsColor: ["#262731", "#262731", "#262731",  "white", "#262731", "#262731"]
                                    },
                                    console.log("60")
                                )}
                                selectedColor={this.state.selectedPointsColor[3]}>
                                60
                            </Chip>
                            <Chip
                                style={ this.state.isSelectedPoints[4] === false ? styles.chipStyle : styles.chipStylePressed }
                                onPress={() => this.setState(
                                    {
                                        isSelectedPoints: [false, false, false, false, true, false], 
                                        selectedPoints: "80", 
                                        selectedPointsColor: ["#262731", "#262731", "#262731", "#262731", "white", "#262731"]
                                    },
                                    console.log("80")
                                )}
                                selectedColor={this.state.selectedPointsColor[4]}>
                                80
                            </Chip>
                            <Chip
                                style={ this.state.isSelectedPoints[5] === false ? styles.chipStyle : styles.chipStylePressed }
                                onPress={() => this.setState(
                                    {
                                        isSelectedPoints: [false, false, false, false, false, true], 
                                        selectedPoints: "100", 
                                        selectedPointsColor: ["#262731", "#262731", "#262731", "#262731", "#262731", "white"]
                                    },
                                    console.log("100")
                                )}
                                selectedColor={this.state.selectedPointsColor[5]}>
                                100
                            </Chip>    
                        </View>
                        <HelperText  type="error" visible={ this.state.errorFromPointsInput } style={{width:'90%'}}>
                            { this.pointsErrorMessage }
                        </HelperText>
                    </View>
                </KeyboardAwareScrollView>
                        <Button 
                        style={ {backgroundColor: "#262731", marginBottom:"2%", width:"55%", height: 40, alignSelf: 'center'} }
                        theme={ {roundness: 20} }
                        mode="contained"
                        onPress = { this.postBug }
                        >
                                    POST BUG
                        </Button>
                        <Button 
                        style={ {backgroundColor: "#262731", marginTop: "2%", marginBottom:"4%", width:"55%", height: 40, alignSelf: 'center'} }
                        theme={ {roundness: 20} }
                        mode="contained"
                        onPress = { async () => {  
                                            const {status} = await Camera.requestPermissionsAsync()
                                            if(status === 'granted'){
                                                this.props.navigation.navigate('CameraScreen')
                                            }else{
                                                Alert.alert("Access denied")
                                            } 
                                        }
                                    }  
                        >
                                    UPLOAD (*optional)
                        </Button>
                        { this.props.route.params.image.uri !== null ?
                            <View style={{alignItems:'center', width:'100%',justifyContent:'center'}}>
                                <Avatar.Icon size={24} icon="image-plus" style={{backgroundColor:"#262731"}} />
                                { this.state.uploadProgress === 0 ?
                                    <Text style={ {fontSize: 10, fontWeight: 'bold', color: "#262731"} }>
                                        Image Ready
                                    </Text>
                                :
                                    <Text style={ {fontSize: 10, fontWeight: 'bold', color: "#262731"} }>
                                        Image Uploaded
                                    </Text>
                                }
                                { this.state.uploadProgress > 0 ?
                                    <Progress.Bar progress={this.state.uploadProgress} width={250} color="#262731" style={{marginBottom:'2%'}}/>
                                :
                                    null
                                }
                            </View>
                            :
                            null
                        }
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