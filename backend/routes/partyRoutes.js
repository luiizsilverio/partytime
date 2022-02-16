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
      return res.status(400).json({ error })
    }

  } catch(error) {
    return res.status(400).json({ error: "Acesso negado"})
  }
})

// get all public parties
router.get("/all", async (req, res) => {
  try {
    const parties = await Party.find({ privacy: false }).sort([['_id', -1]])

    res.json({ error: null, parties })

  } catch (error) {
    return res.status(400).json({ error })
  }
})

// get all user parties
router.get("/userparties", verifyToken, async (req, res) => {
  // verify user
  const token = req.header("auth-token")
  const userByToken = await getUserByToken(token)
  const userId = userByToken._id.toString()

  try {
    const parties = await Party.find({ userId })

    return res.json({ error: null, parties })
  
  } catch (error) {
    return res.status(400).json({ error })
  }  
})

// get party by partyId
router.get("/userparty/:id", verifyToken, async (req, res) => {
  const partyId = req.params.id

  // verify user
  const token = req.header("auth-token")
  const userByToken = await getUserByToken(token)
  const userId = userByToken._id.toString()  

  try {
    const party = await Party.findOne({ _id: partyId, userId })

    return res.json({ error: null, party })
  
  } catch (error) {
    return res.status(400).json({ error })
  }  
})

// get party (public or private)
router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const party = await Party.findOne({ _id: id })

    if (!party) {
      return res.status(400).json({ error: "Evento não existe" })
    }

    // public party
    if (!party.privacy) {
      return res.json({ error: null, party })
      
      // private party
    } else {
      try {
        // verify user
        const token = req.header("auth-token")        
        const userByToken = await getUserByToken(token)
        const userId = userByToken._id.toString()  

        if (userId === party.userId.toString()) {
          return res.json({ error: null, party })
        } else {
          return res.status(400).json({ error: "Acesso negado*" })
        }

      } catch (error) {
          return res.status(400).json({ error: "Acesso negado"})         
      }          
    }
  } catch (error) {
    return res.status(400).json({ error })
  } 
})

// delete a party
router.delete("/", verifyToken, async (req, res) => {

  const token = req.header("auth-token")        
  const user = await getUserByToken(token)
  const userId = user._id.toString()
  const partyId = req.body.id

  try {

    await Party.deleteOne({ _id: partyId, userId })

    res.json({ error:null, message: "Evento removido com sucesso"})

  } catch (error) {
    return res.status(400).json({ error: "Acesso negado" })
  }
})

module.exports = router
