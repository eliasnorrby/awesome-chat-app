import React, {useState, useRef} from 'react'
import './App.css'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyCMSannGUf2AcR_70KQsNE0Jr_8MyzQugY",
  authDomain: "awesome-chat-app-de30c.firebaseapp.com",
  databaseURL: "https://awesome-chat-app-de30c.firebaseio.com",
  projectId: "awesome-chat-app-de30c",
  storageBucket: "awesome-chat-app-de30c.appspot.com",
  messagingSenderId: "250360598240",
  appId: "1:250360598240:web:04fca1afc097a764838a85"
})

const auth = firebase.auth()
const firestore = firebase.firestore()

function App() {
  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <header className="App-header">
        <h1>Awesome Chat</h1>
        <SignOut />
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  )
}

function ChatRoom() {

  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)

  const [messages] = useCollectionData(query, {idField: 'id'})

  const [formValue, setFormValue] = useState('')

  const scrollRef = useRef()

  const sendMessage = async (e) =>{
    e.preventDefault()

    const { uid, photoURL } = auth.currentUser

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    scrollRef.current.scrollIntoView({ behaviour: 'smooth'})

    setFormValue('')
  }

  return (
   <div>
     <main>
       { messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} /> )}
       <span ref={scrollRef}></span>
     </main>
     <form onSubmit={sendMessage} >
       <input value={formValue} onChange={e => setFormValue(e.target.value)} />
       <button type="submit" disabled={!formValue}>Send</button>
     </form>
   </div>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message

  const messageClass = auth.currentUser.uid === uid ? 'sent' : 'received'

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="avatar" />
      <p>{text}</p>
    </div>
  )
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

  return <button onClick={signInWithGoogle} >Sign in with Google</button>
}

function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()} >Sign Out</button>
  )
}

export default App
