import React from 'react';
import { Text, View, ImageBackground, } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const background_image_source = require('../images/signup-background.png');

export default class SignUp extends React.Component{

    constructor(){
        super();

        this.state = {
            isPasswordVisible: true,
            iconNamePassword: "eye-off",
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

    _onSignUpPress = () => {
        console.log("Am apasat pe sign up");
    }

    _onAlreadyAStackerPress = () => {
        this.props.navigation.navigate("LogIn");
    }

    render(){
        return(
            <View style={{ flex:1, backgroundColor: 'red' }}>
                <ImageBackground    source = { background_image_source }
                                    resizeMode = "cover"
                                    style = {{
                                        flex:1,
                                    }} 
                >
                    <View style={{flex:0.35}}></View>
                    <View style={{flex:0.55, justifyContent:'center', alignItems: 'center'}}>
                        <TextInput
                            theme={{ roundness: 20 }} 
                            style={{backgroundColor:"white", width:"90%"}}
                            outlineColor="#262731"
                            activeOutlineColor="#262731"
                            mode="outlined"
                            label="Username"
                            placeholder="Please type your username"
                            right={<TextInput.Icon name="account-check" color="#262731" />}
                        />
                        <TextInput
                            theme={{ roundness: 20 }} 
                            style={{backgroundColor:"white", width:"90%", marginTop:"5%"}}
                            outlineColor="#262731"
                            activeOutlineColor="#262731"
                            mode="outlined"
                            label="Email"
                            placeholder="Please type your email"
                            right={<TextInput.Icon name="email" color="#262731" />}
                        />
                        <TextInput
                            secureTextEntry={ this.state.isPasswordVisible }
                            theme={{ roundness: 20 }} 
                            style={{backgroundColor:"white", width:"90%", marginTop:"5%"}}
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
                        />
                        <Button style={{backgroundColor:"#262731", marginTop:"10%", width:"40%", height: 40}}
                                theme={{ roundness: 20 }}
                                mode="contained"
                                onPress = { this._onSignUpPress }
                        >
                            SIGN UP
                        </Button>
                        <Button style = {{marginTop:"3%"}}
                                color = "#262731"
                                mode = "text"
                                onPress = { this._onAlreadyAStackerPress }
                        >
                            <Text style={{fontFamily:'normal-font', fontSize:10}}>
                                Already a stacker? <Text style={{fontWeight:"bold"}}>LOGIN</Text>
                            </Text>    
                        </Button>
                    </View>
                    <View style={{flex:0.10}}></View>

                </ImageBackground>
            </View>
        )
    }

}