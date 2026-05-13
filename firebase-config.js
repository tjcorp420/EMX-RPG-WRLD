// firebase-config.js
// EMX Soul Arena Multiplayer Firebase Config

export const firebaseConfig = {
  apiKey: "AIzaSyCej8Z8qNNzb1IojNikocvSWyEbcCAkt4Y",
  authDomain: "emx-rpg-elsa.firebaseapp.com",
  databaseURL: "https://emx-rpg-elsa-default-rtdb.firebaseio.com",
  projectId: "emx-rpg-elsa",
  storageBucket: "emx-rpg-elsa.firebasestorage.app",
  messagingSenderId: "978837421406",
  appId: "1:978837421406:web:6ec2c83186233ad3e2a3cf",
  measurementId: "G-T2B8E3EYD4"
};

export const hasFirebaseConfig = Object.values(firebaseConfig).every(
  (value) =>
    typeof value === "string" &&
    value.length > 0 &&
    !value.includes("PASTE_")
);
