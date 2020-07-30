import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "buggi-tracker.firebaseapp.com",
  databaseURL: "https://buggi-tracker.firebaseio.com",
  projectId: "buggi-tracker",
  storageBucket: "buggi-tracker.appspot.com",
  messagingSenderId: "849739986014",
  appId: "1:849739986014:web:04062c9ca9c49c3abb30cf",
  measurementId: "G-5776168GN8"
};

firebase.initializeApp(config);

export const auth = firebase.auth;
export const db = firebase.firestore();
export const functions = firebase.functions;
