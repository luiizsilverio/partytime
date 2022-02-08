const router = require("express").Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/user")

// get user
router.get("/", async (req, res) => {
  res.json({ message: "usuários"})
})

module.exports = router