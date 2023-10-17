import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCbLFlTxsmqNklacg5jHm_ciJ8S33fRDeA",
  authDomain: "pintm-4b550.firebaseapp.com",
  databaseURL: "https://pintm-4b550-default-rtdb.firebaseio.com",
  projectId: "pintm-4b550",
  storageBucket: "pintm-4b550.appspot.com",
  messagingSenderId: "76436511253",
  appId: "1:76436511253:web:60f85da6d20841846b4c1c",
  measurementId: "G-7J4E7D965X"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);

export function authState(){
  auth.onAuthStateChanged(function(user) {
    if(user){
      var login = document.querySelector('#headerLogin');
      if(login){
        login.setAttribute('href', '/account');
        login.innerHTML = user.displayName;
      }
    }
  });
}