const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


app.use(cors())
app.use(express.json())
morgan.token('body', (req, res) => {return JSON.stringify(req.body)})

let people = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]



app.get('/info', morgan('tiny'), (request, response) => {
 response.send(`<p>Phonebook has info for ${people.length}</p>`+`<p>${new Date().toString()}</p>`)
 console.log('/info')
})

app.get('/api/persons', morgan('tiny'), (request, response) => {
  response.json(people)
})

app.get('/api/persons/:id', morgan('tiny'), (request, response) => {
    let id = request.params.id
    let individual = (people.find(person => person.id === id))

    if (individual) {
        response.json(individual)   
    } else {
        response.status(404).send({error: 'Person not found'})
    }
})

app.delete('/api/persons/:id', morgan('tiny'), (request, response) => {
  let id = request.params.id
  persons = people.filter(person => person.id !== id)
  
  response.status(204).end()
})

app.post('/api/persons', morgan(':method :url :status :res[content-length] - :response-time ms :body'), (request, response) => {
  let newPerson = request.body
  newPerson.id = Math.floor(Math.random() * 100000)

  if (!newPerson.name || !newPerson.number) {
    response.status(400).send({error: 'New person requires both name and number'})
  } else if (people.find(person => person.name === newPerson.name)) {
    response.status(403).send({error: 'name must be unique'})
  } else {
    persons = people.concat(newPerson)
    response.status(201).json(newPerson)
  }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})