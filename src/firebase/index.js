import firebase from "firebase/app";
import "firebase/storage";
import { firebaseConfig } from "config";

// const firebaseConfig = {
//   apiKey: "AIzaSyDr1BJ0Sh0T-tZuNM-jm8eRE89jcU2rFR4",
//   authDomain: "ludokhelo-dev-670d3.firebaseapp.com",
//   databaseURL: "https://ludokhelo-dev-670d3.firebaseio.com",
//   projectId: "ludokhelo-dev-670d3",
//   storageBucket: "ludokhelo-dev-670d3.appspot.com",
//   messagingSenderId: "207531240336",
//   appId: "1:207531240336:web:4e5ce8647c364fe85aa115"
// };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

export { storage, firebase as default };
