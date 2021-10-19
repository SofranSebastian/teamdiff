import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyB5V08qRzexHyofw1aEqVnlhfuxHMqxty4",
  authDomain: "teamdiff-stackly-24478.firebaseapp.com",
  projectId: "teamdiff-stackly-24478",
  storageBucket: "teamdiff-stackly-24478.appspot.com",
  messagingSenderId: "631275236682",
  appId: "1:631275236682:web:f54bdaa6a1f244510de5b3",
  measurementId: "G-HEFWSMX049"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getUsers = async(db) => {
  const usersCol = collection(db, 'users');
  const userSnapshot = await getDocs(usersCol);
  const userList = userSnapshot.docs.map(user => user.data());
  return userList;
}

getUsers(db).then((users) => {
  users.forEach(user => {
    console.log(user);
  });
}).catch(err => {
  console.log(err);
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
