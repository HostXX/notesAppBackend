/* eslint-disable no-undef */
const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://developer:${password}@socialnetwork.scyeh.mongodb.net/notes?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology:true , useFindAndModify: false, useCreateIndex:true })

const noteSchema = new mongoose.Schema({
    content : String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//     content: 'Javascript is nice!',
//     date: new Date(),
//     important: true,
// })

// note.save().then(result => {
//     console.log('note saved!,',result)
//     mongoose.connection.close()
// }).catch(errr => console.log(errr)
// )

Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)

    })
    mongoose.connection.close()
})