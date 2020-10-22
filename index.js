const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

let notes = [
  {
    id: 0,
    content: 'HTML is easy',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 1,
    content: 'Browser can execute only Javascript',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 2,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
  return maxId + 1
}

const errorHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400)
    console.log(process.env.MODE)
    
     res.json({
      message: 'Something broke with the json parser!',
      stack: process.env.MODE === 'development' ? err.stack : {}
    })
  } else {
    res.status(err.status || 500)
    res.json({
      message: 'Something broke!',
      stack: process.env.MODE === 'development' ? err.stack : {}
    })
  }
}

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan((tokens,req,res) => {
    return [
        tokens.method(req,res),
        tokens.url(req, res),
        tokens.status(req,res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.method(req,res) === 'POST' ? JSON.stringify(req.body) : ''
      ].join(' ')
    
}))
app.use(express.static('build'))

// app.get('/', (req, res) => {
//   res.send('<h1>hello mau</h1>')
// })

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  let note = notes.find(note => note.id === id)

  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)

  res.status(204).end()
})

app.post('/api/notes', (req, res) => {
    const body = req.body

    if (typeof body.content !== 'String' && body.content === '') {
      console.log('is not a string or is empty')
      return res.status(400).json({
        error: 'Content missing or bad content'
      })
    }

    const note = {
      id: generateId(),
      content: body.content,
      important: typeof body.important === 'boolean' ? body.important : false,
      date: Date.now()
    }

    notes = notes.concat(note)
    res.json(note).end()
 
})

app.put('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const body = req.body
  const mappedNotes = notes.map((note)=>{
      return note.id === id ? {...note,...body} : note
    })

  notes = mappedNotes

  const modifiedNote = notes.filter((note)=> note.id === id)

  res.json(...modifiedNote).end()

})

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT,() => console.log(`server running on port ${PORT}`))

