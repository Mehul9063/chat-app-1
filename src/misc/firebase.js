import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const config = {
  apiKey: "AIzaSyDFcVAgEEBkhZrxM5tKVV1Y1usMJHZsIUg",
  authDomain: "chat-web-app-1.firebaseapp.com",
  databaseURL: "https://chat-web-app-1-default-rtdb.firebaseio.com",
  projectId: "chat-web-app-1",
  storageBucket: "chat-web-app-1.appspot.com",
  messagingSenderId: "463492517947",
  appId: "1:463492517947:web:051c03041174b862370c1e"
}

const app = firebase.initializeApp(config)
export const auth = app.auth()
export const database = app.database()