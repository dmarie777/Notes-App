import { useState, useEffect} from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'

import './App.css'

function App() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState(
    'a new note ...'
    )
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happenend...')

  console.log('notes out', notes)

  useEffect(() => {
    noteService 
      .getAll()
      .then (initialNotes => {
        setNotes(initialNotes)
      })
      .catch((err) => {
        setErrorMessage(
          err
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }, [])

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
      .catch((err) => {
        setErrorMessage(
          err.response.data.error
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const deleteNote = (id) => {
    noteService
      .deleteNote(id)
      .then(() => {
        setNotes(notes.filter(e => e.id !== id))
      })
      .catch((err) => {
        setErrorMessage(
          err.response.data.error
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const toggleImportance = (id) => {
    const oldNote = notes.find( note => note.id === id)
    const newNote = {...oldNote, important: !oldNote.important}
    
    noteService
      .update(id, newNote)
      .then(returnedNote => {
        console.log('newnote', returnedNote)
        return setNotes(notes.map( note => note.id !== id? note : returnedNote ))
      })
      .catch(() => {
        setErrorMessage(
          `Note '${oldNote.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const notesToShow = showAll? notes: notes.filter(note => note.important === true)

  return (
    <>
      <div>
        <h1>Notes</h1>
        <Notification message = {errorMessage}/>
        <ul>
          {notesToShow.map(note => 
            <Note 
            key={note.id} 
            note = {note} 
            toggleImportance= {() => toggleImportance(note.id)}
            deleteNote={() => deleteNote(note.id)} />
          )}
        </ul>
        <button onClick={() => setShowAll(!showAll)}>
          Show {showAll? 'important': 'all'} 
        </button>

        <form onSubmit={addNote}>
            <input value={newNote} onChange={handleNoteChange}/>
            <button type='submit' >Add note</button>
        </form>
      </div>
    </>
  )
}

export default App
