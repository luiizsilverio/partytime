const jwt = require("jsonwebtoken")

// middleware to validate token
const checkToken = (req, res, next) => {
  const token = req.header("auth-token")

  if (!token) {
    return res.status(401).json({ error: "Acesso negado" })
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET)
    req.user = verified  // add user parameter to request
    next()

  } catch(err) {
    res.status(400).json({ error: "Token inválido" })
  }
}

module.exports = checkToken