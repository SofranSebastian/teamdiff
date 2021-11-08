import React from 'react';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import AppMainStack from './routes/routes';

import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

import * as firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB5V08qRzexHyofw1aEqVnlhfuxHMqxty4",
  authDomain: "teamdiff-stackly-24478.firebaseapp.com",
  projectId: "teamdiff-stackly-24478",
  storageBucket: "teamdiff-stackly-24478.appspot.com",
  messagingSenderId: "631275236682",
  appId: "1:631275236682:web:f54bdaa6a1f244510de5b3",
  measurementId: "G-HEFWSMX049"
};


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
    firebase.initializeApp( firebaseConfig );
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
