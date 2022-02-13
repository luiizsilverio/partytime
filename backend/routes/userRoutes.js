const router = require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/user")

// middlewares
const verifyToken = require('../middlewares/check-token')

// helpers
const getUserByToken = require("../helpers/get-user-by-token")

// get user
router.get("/:id", verifyToken, async (req, res) => {
  const { id } = req.params

  // verify user
  try {
    const user = await User.findOne({ _id: id }, { password: 0 })

    return res.json({ error: null, user })

  } catch(err) {
    return res.status(400).json({ error: "Usuário não existe" })
  }
})

router.put("/", verifyToken, async (req, res) => {
  const token = req.header('auth-token')
  const { id: userReqId, password, confirmPassword } = req.body

  const user = await getUserByToken(token)

  const userId = user._id.toString()

  // check if user id is equal token user id
  if (userId != userReqId) {
    res.status(401).json({ error: "Acesso negado"})
  }

  // create user object
  const updateData = {
    name: req.body.name,
    email: req.body.email
  }
  
  // check if passwords match
  if (password !== confirmPassword) {
    res.status(401).json({ error: "As senhas não conferem"})
  }

  // change password
  if (password != null) {
    const salt = await bcrypt.genSalt(12) // 12 caracteres
    const passwordHash = await bcrypt.hash(password, salt)  
    updateData.password = passwordHash
  }

  console.log(updateData)
  try {
    const data = await User.findOneAndUpdate({ _id: userId }, { $set: updateData }, { new: true })

    res.json({ error: null, message: "Usuário atualizado com sucesso", data })

  } catch(error) {
    res.status(400).json({ error })
  }  
})

module.exports = router