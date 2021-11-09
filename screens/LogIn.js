import React from 'react';
import { Text, View, ImageBackground, } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const background_image_source = require('../images/login-background.png');

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

    _onLogInPress = () => {
        console.log("Am apasat pe log in");
    }

    _onNotAStackerPress = () => {
        this.props.navigation.navigate("SignUp");
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
                    <View style={{flex:0.35}}></View>
                    <View style={{flex:0.55, justifyContent:'center', alignItems: 'center'}}>
                        <TextInput
                            theme={{ roundness: 20, colors: { text:'white', placeholder:'white'  } }}
                            style={{backgroundColor:"#262731", width:"90%"}}
                            outlineColor="white"
                            activeOutlineColor="white"
                            mode="outlined"
                            label="Username"
                            placeholder="Please type your username"
                            right={<TextInput.Icon name="account-check" color="white" />}
                        />
                        <TextInput
                            secureTextEntry={ this.state.isPasswordVisible }
                            theme={{ roundness: 20, colors: { text:'white', placeholder:'white'  } }}
                            style={{backgroundColor:"#262731", width:"90%", marginTop:"5%"}}
                            outlineColor="white"
                            activeOutlineColor="white"
                            mode="outlined"
                            label="Password"
                            placeholder="Please type your password"
                            right={ <TextInput.Icon     name={ this.state.iconNamePassword } 
                                                        color="white" 
                                                        onPress = { this._onPasswordIconPress }
                                    />
                            }
                        />
                        <Button style={{backgroundColor:"white", marginTop:"10%", width:"40%", height: 40}}
                                theme={{ roundness: 20 }}
                                mode="contained"
                                
                                onPress = { this._onLogInPress }
                        >
                            <Text style={{color:"#262731"}}>LOG IN</Text>
                        </Button>
                        <Button style = {{marginTop:"3%"}}
                                color = "white"
                                mode = "text"
                                onPress = { this._onNotAStackerPress }
                        >
                            <Text style={{fontFamily:'normal-font', fontSize:10}}>
                                Not a stacker? <Text style={{fontWeight:"bold"}}>SIGN UP</Text>
                            </Text>    
                        </Button>
                    </View>
                    <View style={{flex:0.10}}></View>

                </ImageBackground>
            </View>
        )
    }

}