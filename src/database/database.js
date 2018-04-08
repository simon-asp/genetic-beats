import firebase, { auth } from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDV-Q5Ox99g1rsj0CcnHO8rvn_hhmq2Tls",
  authDomain: "genetic-beats.firebaseapp.com",
  databaseURL: "https://genetic-beats.firebaseio.com",
  projectId: "genetic-beats",
  storageBucket: "genetic-beats.appspot.com",
  messagingSenderId: "647929446006"
};
firebase.initializeApp(firebaseConfig);
export const database = firebase.database();

let currentUserUniqueKey;

// Get the user unique key from the users child node in firebase. Returns a Promise
export function setUserUniqueKey() {
  let userUniqueKey = 0;
  const query = database.ref('/users').orderByChild('userId').equalTo(auth().currentUser.email);

  query.once('value', data => {
    data.forEach(userSnapshot => {
        userUniqueKey = userSnapshot.key;
    });
  })
  .then(() => {
    currentUserUniqueKey = userUniqueKey;
    console.log(currentUserUniqueKey)
  })
}

export function getUserUniqueKey() {
  return currentUserUniqueKey;
}