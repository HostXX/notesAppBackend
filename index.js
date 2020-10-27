const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const { errorHandler, notFoundHandler } = require('./middlewares')
const Note = require('./database/models/note')

// let notes = [
//     {
//         id: 0,
//         content: 'HTML is easy',
//         date: '2019-05-30T17:30:31.098Z',
//         important: true
//     },
//     {
//         id: 1,
//         content: 'Browser can execute only Javascript',
//         date: '2019-05-30T18:39:34.091Z',
//         important: false
//     },
//     {
//         id: 2,
//         content: 'GET and POST are the most important methods of HTTP protocol',
//         date: '2019-05-30T19:20:14.298Z',
//         important: true
//     }
// ]


const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(
    morgan((tokens, req, res) => {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'),
            '-',
            tokens['response-time'](req, res),
            'ms',
            tokens.method(req, res) === 'POST' ? JSON.stringify(req.body) : ''
        ].join(' ')
    })
)



app.get('/api/notes', (req, res, next) => {
    Note.find({}).then(_notes => {
        res.json(_notes)
    }).catch((err) => {
        next(err)
    })
})

app.get('/api/notes/:id', (req, res,next) => {
    const id = req.params.id
    Note.findById(id)
        .then(note => {
            if (note) {
                return res.json(note)
            } else {
                return res.status(404).end()
            }
        })
        .catch((err) => {
            console.log(err)

            next(err)
        })
})

app.delete('/api/notes/:id', (req, res, next) => {
    const id = Number(req.params.id)

    Note.findByIdAndRemove(id)
        .then(() => {
            res.status(204).end()
        })
        .catch(err => next(err))
})

app.post('/api/notes', (req, res, next) => {
    const body = req.body

    if (typeof body.content !== 'string' && body.content === '') {
        console.log('is not a string or is empty')
        return res.status(400).json({
            error: 'Content missing or bad content'
        })
    }

    const note = new Note({
        content: body.content,
        important: typeof body.important === 'boolean' ? body.important : false,
        date: Date.now()
    })

    // notes = notes.concat(note)
    // console.log(notes)

    note
        .save()
        .then(note => {
            console.log('note saved!,', note)
            return res.json(note.toJSON())
        })
        .catch(err => {
            console.log(err)
            next(err)
        })
})

app.put('/api/notes/:id', (req, res, next) => {
    const id = req.params.id
    const body = req.body

    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(id, note, { new: true })
        .then(updatedNote => {
            res.json(updatedNote)
        })
        .catch(err => next(err))
})


app.use(notFoundHandler)
app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
