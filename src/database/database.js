import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDV-Q5Ox99g1rsj0CcnHO8rvn_hhmq2Tls",
  authDomain: "genetic-beats.firebaseapp.com",
  databaseURL: "https://genetic-beats.firebaseio.com",
  projectId: "genetic-beats",
  storageBucket: "genetic-beats.appspot.com",
  messagingSenderId: "647929446006"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

export default database;