
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: 'AIzaSyD48xOYK8SZaSfbtXG6F66lbSk5-MMVToA',
    authDomain: 'aab-f47fc.firebaseapp.com',
    databaseURL: 'https://aab-f47fc-default-rtdb.firebaseio.com',
    projectId: 'aab-f47fc',
    storageBucket: 'aab-f47fc.appspot.com',
    messagingSenderId: '408257656220',
    appId: '1:408257656220:web:8761aecf9039e098d78459',
    measurementId: 'G-5BSS7ZDCG1'
  }

  const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;