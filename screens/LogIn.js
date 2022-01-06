import React, { Component } from "react";
import { Text, View, ImageBackground } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { usersCol } from "../db/firebaseDB";
import { query, where, getDocs } from "@firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const background_image_source = require('../images/signup-background.png');

class LogIn extends Component {
    constructor() {
        super();

        this.usernameErrorMessage = "";
        this.passwordErrorMessage = "";

        this.userIDfromFirestore = "";

        this.state = {
            errorFromUsernameInput: false,
            errorFromPasswordInput: false,
            isPasswordVisible: true,
            iconNamePassword: "eye-off",
            usernameFromInput: "",
            passwordFromInput: "",
            emailFromDB: ""
        };
    }

    _onPasswordIconPress = () => {
        this.setState({isPasswordVisible: !this.state.isPasswordVisible});
        if (this.state.isPasswordVisible === true) {
            this.setState({iconNamePassword: "eye"})
        } else {
            this.setState({iconNamePassword: "eye-off"})
        }
    }

    checkUsername = async (username) => {
        const q = query(usersCol, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            querySnapshot.forEach(user => {
                this.setState({emailFromDB: user.data().email});
                this.userIDfromFirestore = user.id
            })
            return true;
        }
        return false;
    }

    async _onSignInPress() {
        let exists = await this.checkUsername(this.state.usernameFromInput);
    
        if (exists) {
            this.setState({
                errorFromUsernameInput: false,
            })

            const auth = getAuth();

            await signInWithEmailAndPassword(auth, this.state.emailFromDB, this.state.passwordFromInput)
                .then(userCredential => {
                    this.setState({errorFromPasswordInput: false});
                    const user = userCredential.user;
                })
                .then( () => {
                            try {
                                AsyncStorage.setItem('userID', this.userIDfromFirestore );
                                AsyncStorage.setItem('userName', this.state.usernameFromInput);
                            } catch (e) {
                                // saving error
                            }
                    }
                )
                .then(() => {
                    this.props.navigation.navigate("Home");
                })
                .catch(error => {
                    if (error.message.includes("wrong-password")) {
                        this.passwordErrorMessage = "The password is invalid.";
                        this.setState({errorFromPasswordInput: true});
                    }
                    else {
                        this.passwordErrorMessage = "Please input your password";
                        this.setState({errorFromPasswordInput: true});
                    }
                })
        }
        else {
            this.usernameErrorMessage = `The user ${this.state.usernameFromInput} doesn't exist.`
            this.setState({
                errorFromUsernameInput: true,
            })
            console.log(`The user ${this.state.usernameFromInput} doesn't exist.`);
        }
    }

    _goToSignUpScreen = () => {
        this.props.navigation.navigate("SignUp");
    }

    _goToHomeScreen = () => {
        this.props.navigation.navigate("Home");
    }

    render() {
        return (
            <View style={ {flex: 1 } }>
                <ImageBackground source={ background_image_source } resizeMode="cover" style={ {flex: 1} }>
                    <View style={ {flex: 0.45} }></View>
                    <View style={ {flex: 0.35, justifyContent: 'center', alignItems: 'center'} }>
                        <TextInput
                            autoCapitalize="none"
                            theme={ { roundness: 20 } }
                            style={ {backgroundColor: "white", width: "90%"} }
                            outlineColor="#262731"
                            activeOutlineColor="#262731"
                            mode="outlined"
                            label="Username"
                            placeholder="Please type your username"
                            right={ <TextInput.Icon name="account-check" color="#262731" /> }
                            onChangeText={ username => this.setState({usernameFromInput: username.trim().toLowerCase()}) }
                        />
                        <HelperText type="error" visible={ this.state.errorFromUsernameInput }>
                            { this.usernameErrorMessage }
                        </HelperText>
                        <TextInput
                            autoCapitalize='none'
                            secureTextEntry={ this.state.isPasswordVisible }
                            theme={{ roundness: 20 }} 
                            style={{backgroundColor:"white", width:"90%"}}
                            outlineColor="#262731"
                            activeOutlineColor="#262731"
                            mode="outlined"
                            label="Password"
                            placeholder="Please type your password"
                            right={ 
                                <TextInput.Icon name={ this.state.iconNamePassword }
                                                color="#262731"
                                                onPress={ this._onPasswordIconPress }/>
                            }
                            onChangeText={ password => this.setState({passwordFromInput: password}) }
                        />
                        <HelperText  type="error" visible={ this.state.errorFromPasswordInput } style={{width:'90%'}}>
                            { this.passwordErrorMessage }
                        </HelperText>
                        <Button 
                            style={ {backgroundColor: "#262731", marginTop: "10%", width: "40%", height: 40} }
                            theme={ {roundness: 20} }
                            mode="contained"
                            onPress = { async () => this._onSignInPress() }
                        >
                            LOG IN
                        </Button>
                        <Button 
                            style={ {marginTop: "3%"} }
                            color="#262731"
                            mode="text"
                            onPress={ this._goToSignUpScreen }
                        >
                            <Text style={ {fontFamily: 'normal-font', fontSize: 10} }>
                                Not a stacker? <Text style={ {fontWeight: "bold"} }>SIGN UP</Text>
                            </Text>
                        </Button>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

export default LogIn;