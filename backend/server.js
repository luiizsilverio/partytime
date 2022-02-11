const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

require("dotenv").config()
console.log('secret:', process.env.SECRET)

const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')

const dbname = "partydb"
const port = 3000

const app = express()

app.use(cors())

// para o Express entender JSON
app.use(express.json()) 

// define a pasta de arquivos estáticos
app.use(express.static('public'))

// habilita o uso do body nas requisições
app.use(express.urlencoded({ extended: true }))

// rota de autenticação
app.use('/api/auth', authRouter)

// rota de usuários
app.use('/api/user', userRouter)

// conexão mongodb
mongoose.connect(
  `mongodb://localhost:27017/${dbname}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)

app.get("/", (req, res) => {
  res.json({ message: "partytime"})
})

app.listen(port, () => {
  console.log(`partytime-api rodando na porta ${port}`)
})
