const router = require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/user")

// register user
router.post("/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body

  // check for required fields
  if (!name || !email || !password || !confirmpassword) {
    return res.status(400).json({ error: "Preencha todos os campos"})
  }

  // check if passwords match
  if (password != confirmpassword) {
    return res.status(400).json({ error: "Senhas não conferem"})
  }

  // check if user exists
  const emailExists = await User.findOne({ email: email })

  if (emailExists) {
    return res.status(400).json({ error: "O e-mail informado já está em uso"})
  }

  // create password
  const salt = await bcrypt.genSalt(12) // 12 caracteres
  const passwordHash = await bcrypt.hash(password, salt)

  // create user
  const user = new User({
    name,
    email,
    password: passwordHash
  })
  
  try {

    const newUser = await user.save()

    // create token
    const token = jwt.sign(
      { // payload
        name: newUser.name,
        id: newUser._id
      },
      "mongo123" // secret      
    )

    // return token
    res.json({
      error: null, 
      message: "Você realizou o cadastro com sucesso",
      token,
      userId: newUser._id
    })

  } catch (err) {
    res.status(400).json({ error })
  }  
})


// user login
router.post("/login", async (req, res) => {
  const { email, password } = req.body
  
  // check if user exists
  const user = await User.findOne({ email })

  if (!user) {
    return res.status(400).json({ error: "Senha ou e-mail incorreto"})
  }

  // check if password match
  const checkPassword = await bcrypt.compare(password, user.password)

  if (!checkPassword) {
    return res.status(400).json({ error: "Senha ou e-mail incorreto"})
  }

  // create token
  const token = jwt.sign(
    { // payload
      name: user.name,
      id: user._id
    },
    "mongo123" // secret      
  )

  // return token
  res.json({
    error: null, 
    message: "Você está autenticado",
    token,
    user: user._id
  })
})


module.exports = router
