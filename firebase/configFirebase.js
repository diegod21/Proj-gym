
const { initializeApp } = require("firebase/app");
const { getFirestore } = require('firebase/firestore/lite');

const firebaseConfig = {
  apiKey: "AIzaSyCyYTmDUtm06ZHeC2Cbkzof-ih5IuPUtMw",
  authDomain: "clients-gym.firebaseapp.com",
  projectId: "clients-gym",
  storageBucket: "clients-gym.appspot.com",
  messagingSenderId: "1013439373127",
  appId: "1:1013439373127:web:388907b99a69ee994a7662",
  measurementId: "G-LNHGXETPNY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {db}