const router = require("express").Router()
const jwt = require("jsonwebtoken")
const multer = require("multer")

const Party = require("../models/party")
const User = require("../models/user")

// define file storage
const diskStorage = require("../helpers/file-storage")
const upload = multer({ storage: diskStorage })

// middlewares
const verifyToken = require("../middlewares/check-token")

// helpers
const getUserByToken = require("../helpers/get-user-by-token")

// create a new party
router.post("/", verifyToken, upload.fields([{ name: "photos" }]), async (req, res) => {
  const { title, description, party_date, privacy } = req.body

  if (!title || !description || !party_date) {
    return res.status(400).json({ error: "Preencha o nome, a descrição e a data"})
  }

  let files = []

  if (req.files) {
    files = req.files.photos
  }

  // verify user
  const token = req.header("auth-token")
  const userByToken = await getUserByToken(token)
  const userId = userByToken._id.toString()

  try {
    const user = await User.findOne({ _id: userId })

    let photos = []

    if (files && files.length > 0) {
      files.forEach((photo, i) => {
        photos[i] = photo.path
      })
    }

    const party = new Party({
      title,
      description,
      partyDate: party_date,
      photos,
      privacy,
      userId: userId
    })

    try {
      const newParty = await party.save()

      return res.json({ 
        error: null, 
        message: "Evento criado com sucesso", 
        data: newParty
      })

    } catch(error) {
      return res.status(200).json({ error })
    }

  } catch(error) {
    return res.status(200).json({ error: "Acesso negado"})
  }


})

module.exports = router
