import React from 'react';
import { Text, View, ImageBackground, } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { getAuth, createUserWithEmailAndPassword } from '@firebase/auth';
import { usersCol } from "../db/firebaseDB";
import { addDoc } from 'firebase/firestore';

const background_image_source = require('../images/signup-background.png');

export default class SignUp extends React.Component{

    constructor(){
        super();

        this.emailErrorMessage = "";
        this.usernameErrorMessage = "";
        this.passwordErrorMessage = "";

        this.state = {
            isPasswordVisible: true,
            iconNamePassword: "eye-off",

            errorFromUsernameInput: false,
            errorFromEmailInput: false,
            errorFromPasswordInput: false,

            usernameFromInput:'',
            passwordFromInput:'',
            emailFromInput:'',
            bugs: [],
            bugsAsked: 0,
            bugsFixed: 0,
            bugsScore: 100,
        }
    }

    _onPasswordIconPress = () => {
        this.setState({ isPasswordVisible: !this.state.isPasswordVisible });
        if( this.state.isPasswordVisible === true ){
            this.setState({ iconNamePassword : "eye" })
        }else{
            this.setState({ iconNamePassword : "eye-off" })
        }
    }

    _checkUsername = ( username ) => {

        var regEx = /^[a-zA-Z0-9]+$/;

        if( username.match(regEx) ){
            if( username.length >= 6 ){
                this.setState({ errorFromUsernameInput: false });

                return true;
            }else{
                this.setState({ errorFromUsernameInput: true });
                this.usernameErrorMessage = "The username is too short(minimum 6 characters)."

                return false;
            }
        }else{
            this.setState({ errorFromUsernameInput: true });
            this.usernameErrorMessage = "The username is invalid."

            return false;
        }
    }

    _checkEmail = ( email ) => {

        var regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if( email.match(regEx) ){
            this.setState({ errorFromEmailInput: false });

            return true;
        }else{
            this.setState({ errorFromEmailInput: true });
            this.emailErrorMessage = "The email is invalid."

            return false;
        }
    }

    _checkPassword = ( password ) => {

        var regEx = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if( password.match(regEx) ){
            this.setState({ errorFromPasswordInput: false });

            return true;
        }else{
            this.setState({ errorFromPasswordInput: true });
            this.passwordErrorMessage = "Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character."

            return false;
        }
    }

    async _onSignUpPress(){
        if( this._checkUsername( this.state.usernameFromInput ) ){
            if( this._checkEmail( this.state.emailFromInput ) ){
                if( this._checkPassword( this.state.passwordFromInput ) ){
                    
                    let newUser = {
                        username: this.state.usernameFromInput,
                        email: this.state.emailFromInput,
                        bugs: this.state.bugs,
                        bugsAsked: this.state.bugsAsked,
                        bugsFixed: this.state.bugsFixed,
                        bugsScore: this.state.bugsScore,
                        notifications: Array()
                    }
                    
                    const auth = getAuth();

                    await createUserWithEmailAndPassword(auth, this.state.emailFromInput, this.state.passwordFromInput)
                        .then(() => {
                            let userRef = addDoc(usersCol, newUser );
                    
                            if (userRef) {
                                this._goToLoginScreen();
                            }
                            else {
                                console.log("Error in adding the user to the users collection.");
                            }
                        })
                        .catch(error => {
                            console.log(error.message);
                            this.emailErrorMessage = "Account already associated with this email.";
                            this.setState({errorFromEmailInput: true})
                        })
                }
            }
        }
    }

    _goToLoginScreen = () => {
        this.props.navigation.navigate("LogIn");
    }

    render(){
        return(
            <View style={{ flex:1 }}>
                <ImageBackground    source = { background_image_source }
                                    resizeMode = "cover"
                                    style = {{
                                        flex:1,
                                    }} 
                >
                    <View style={{flex:0.40}}></View>
                    <View style={{flex:0.55, justifyContent:'center', alignItems: 'center'}}>
                        <TextInput
                            autoCapitalize='none'
                            theme={{ roundness: 20 }} 
                            style={{backgroundColor:"white", width:"90%"}}
                            outlineColor="#262731"
                            activeOutlineColor="#262731"
                            mode="outlined"
                            label="Username"
                            placeholder="Please type your username"
                            right={<TextInput.Icon name="account-check" color="#262731" />}
                            onChangeText={  
                                ( username ) => this.setState({ usernameFromInput: username.trim().toLowerCase() })
                            }
                        />
                        <HelperText type="error" visible={ this.state.errorFromUsernameInput }>
                            { this.usernameErrorMessage }
                        </HelperText>
                        <TextInput
                            autoCapitalize='none'
                            theme={{ roundness: 20 }} 
                            style={{backgroundColor:"white", width:"90%"}}
                            outlineColor="#262731"
                            activeOutlineColor="#262731"
                            mode="outlined"
                            label="Email"
                            placeholder="Please type your email"
                            right={<TextInput.Icon name="email" color="#262731" />}
                            onChangeText={  
                                ( email ) => this.setState({ emailFromInput: email})
                            }
                        />
                        <HelperText type="error" visible={ this.state.errorFromEmailInput }>
                            { this.emailErrorMessage }
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
                            right={ <TextInput.Icon     name={ this.state.iconNamePassword } 
                                                        color="#262731" 
                                                        onPress = { this._onPasswordIconPress }
                                    />
                            }
                            onChangeText={  
                                ( password ) => this.setState({ passwordFromInput: password })
                            }
                        />
                        <HelperText  type="error" visible={ this.state.errorFromPasswordInput } style={{width:'90%'}}>
                            { this.passwordErrorMessage }
                        </HelperText>
                        <Button style={{backgroundColor:"#262731", marginTop:"10%", width:"40%", height: 40}}
                                theme={{ roundness: 20 }}
                                mode="contained"
                                onPress = { async () => this._onSignUpPress() }
                        >
                            SIGN UP
                        </Button>
                        <Button style = {{marginTop:"3%"}}
                                color = "#262731"
                                mode = "text"
                                onPress = { this._goToLoginScreen }
                        >
                            <Text style={{fontFamily:'normal-font', fontSize:10}}>
                                Already a stacker? <Text style={{fontWeight:"bold"}}>LOGIN</Text>
                            </Text>    
                        </Button>
                    </View>
                    <View style={{flex:0.05}}></View>

                </ImageBackground>
            </View>
        )
    }

}