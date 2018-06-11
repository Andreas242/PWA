import firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyBZXbge-4k4tD1FXuq8_Rt4h4iVmnzBi-I',
  authDomain: 'vuepwa-c0055.firebaseapp.com',
  databaseURL: 'https://vuepwa-c0055.firebaseio.com',
  projectId: 'vuepwa-c0055',
  storageBucket: 'vuepwa-c0055.appspot.com',
  messagingSenderId: '938261468280'
}

firebase.initializeApp(config)

export default {
  database: firebase.database(),
  storage: firebase.storage()
}
