
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
//   authDomain: "interviewiq-ba6ba.firebaseapp.com",
//   projectId: "interviewiq-ba6ba",
//   storageBucket: "interviewiq-ba6ba.firebasestorage.app",
//   messagingSenderId: "862159592601",
//   appId: "1:862159592601:web:7308d702cd708076ddec08"
// };

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "smartinterviewiq.firebaseapp.com",
  projectId: "smartinterviewiq",
  storageBucket: "smartinterviewiq.firebasestorage.app",
  messagingSenderId: "391192873880",
  appId: "1:391192873880:web:7f9dee8a29ad7c0c7539ed"
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBt18iPOoH4qeVeo5zNBVRLFM9Iiz0yvFw",
//   authDomain: "smartinterviewiq.firebaseapp.com",
//   projectId: "smartinterviewiq",
//   storageBucket: "smartinterviewiq.firebasestorage.app",
//   messagingSenderId: "391192873880",
//   appId: "1:391192873880:web:7f9dee8a29ad7c0c7539ed"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);