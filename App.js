import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppMainStack from './routes/routes';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

const customFonts = {
  'normal-font' : require('./fonts/Proxima-Nova-Font.otf'),
};

export default class App extends React.Component {
  
  constructor(){
    super();

    this.state = {
      areFontsLoaded: false,
    }
  }

  async _loadFontsAsync(){
    await Font.loadAsync( customFonts );
    this.setState({ areFontsLoaded: true });
  }

  async componentDidMount(){
    this._loadFontsAsync();
  }

  render(){
    if( this.state.areFontsLoaded ){
      return(
        <AppMainStack />
      )
    }else{
      return(
        <AppLoading />
      )
    }
  }

}