const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]

// const url = `mongodb+srv://deys:${password}@cluster0.lhtlhhq.mongodb.net/noteApp?retryWrites=true&w=majority`
// url for test///
const url = `mongodb+srv://deys:${password}@cluster0.hn793gc.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// const note1 = new Note({
//   content: 'HTML is Easy',
//   important: true,
// })
// note1.save().then(result => {
//   console.log('note saved!')
// })

const note2 = new Note({
  content: 'Browser can execute only JavaScript',
  important: true,
})
note2.save().then(() => {
  mongoose.connection.close()
})

// Note.find({}).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })

