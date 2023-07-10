const connectToMongo = require('./db');
var cors = require('cors')
const express = require('express');
const app = express()
connectToMongo();      
app.use(cors())

const port = 5000

app.use(express.json())  // : to get request body in form of js object

// Available Routes
app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use('/api/auth',require('./routes/auth.js'));
app.use('/api/notes',require('./routes/notes.js'));

app.listen(port, () => {
  console.log(`NoteBook App listening on port ${port}`)
})
// running through nodemom : npm i -D nodemon -install  // D : Dev-dependency