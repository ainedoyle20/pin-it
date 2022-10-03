import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDD61kl9EOdsHw5toEZMqYa4hofQjWrCNo",
  authDomain: "pin-it-69ab6.firebaseapp.com",
  projectId: "pin-it-69ab6",
  storageBucket: "pin-it-69ab6.appspot.com",
  messagingSenderId: "1067820271469",
  appId: "1:1067820271469:web:bb7ef76c6679ea6cb2fc64"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // console.log(userCredential);
    const { uid } = userCredential.user;
    return uid;
  } catch (error) {
    console.log('Error signing up: ', error);
  }
}

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential?.user?.uid;
  } catch (error) {
    console.log('Error logging in: ', error);
  }   
}

export const logOut = async () => {
  try {
    await signOut(auth);
    console.log('Successfully logged out');
  } catch (error) {
    console.log('Error loggin out: ', error);
  }
}

export { onAuthStateChanged, auth }; 