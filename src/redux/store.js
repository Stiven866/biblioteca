import { createStore, combineReducers, compose  } from 'redux';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

/* Custom Reducers*/

import buscarUsuarioReducer from './reducers/buscarUsuarioReducer';


//Configurar firestore

const firebaseConfig = {
    apiKey: "AIzaSyDVe2vXkV3yOxWr2NFirlqh--riYiyDew0",
    authDomain: "biblioteca-dba02.firebaseapp.com",
    databaseURL: "https://biblioteca-dba02.firebaseio.com",
    projectId: "biblioteca-dba02",
    storageBucket: "biblioteca-dba02.appspot.com",
    messagingSenderId: "992930047667",
    appId: "1:992930047667:web:ed7f2679dae92fadc432c6",
    measurementId: "G-CHTMZWH87E"
}

// inicializar firebase
firebase.initializeApp(firebaseConfig);

// configuracion de react-redux
const rrfConfig = {
    userProfile : 'users',
    useFirestoreForProfile: true
}

// crear el enhacer con compose de redux y firestore
const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, rrfConfig),
    reduxFirestore(firebase)
)(createStore);

// Reducers 
const rootReducer = combineReducers({
    firebase : firebaseReducer,
    firestore: firestoreReducer, 
    usuario : buscarUsuarioReducer
})

// state inicial
const initialState = {};

// Create el store
const store = createStoreWithFirebase(rootReducer, initialState, compose(
    reactReduxFirebase(firebase)
));
export default store;

