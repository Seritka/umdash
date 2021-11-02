import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const config = {
  apiKey: 'AIzaSyAAClub3wBVlfuUCY0l_vDpxEPeDdpP9go',
  authDomain: 'test-fdc54.firebaseapp.com',
  databaseURL: 'https://test-fdc54-default-rtdb.firebaseio.com',
  projectId: 'test-fdc54',
  storageBucket: 'test-fdc54.appspot.com',
  messagingSenderId: '866610379359',
  appId: '1:866610379359:web:0f8ba85327683eb035b9ea',
  measurementId: 'G-3HP42D0J2J'
}

const app = initializeApp(config)
const database = getDatabase(app)

export default database
