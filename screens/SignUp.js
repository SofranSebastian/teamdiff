import React from 'react';
import { Text, View, ImageBackground, } from 'react-native';
import { TextInput } from 'react-native-paper';

const background_image_source = require('../images/signup-background.png');

export default class SignUp extends React.Component{

    constructor(){
        super();
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
                    <View style={{flex:0.40}}></View>
                    <View style={{flex:0.40}}>
                        <TextInput
                            outlineColor="#262731"
                            activeOutlineColor="#262731"
                            mode="outlined"
                            label="Username"
                            placeholder="Type something"
                        />
                        <TextInput
                            mode="outlined"
                            label="Email"
                            placeholder="Type something"
                        />
                        <TextInput
                            mode="outlined"
                            label="Password"
                            placeholder="Type something"
                        />
                    </View>
                    <View style={{flex:0.20}}></View>

                </ImageBackground>
            </View>
        )
    }

}