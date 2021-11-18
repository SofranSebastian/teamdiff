import React from 'react';
import { View, Text } from 'react-native';

export default class AddBug extends React.Component{
    constructor(){
        super()
    }

    render(){
        return(
            <View style={{flex:1, backgroundColor:'red'}}>
                <Text>b</Text>
            </View>
        )
    }

}