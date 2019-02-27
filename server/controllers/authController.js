const bcrypt = require('bcryptjs')

module.exports = {
  register: async (req, res) => {
    try {
      const db = req.app.get('db')
      const { username, password, isAdmin } = req.body

      let foundUser = await db.get_user([username])
      const existingUser = foundUser[0]

      if (existingUser){
        res.status(409).send('Username taken')
      }

      let salt = bcrypt.genSaltSync(10)
      let hash = bcrypt.hashSync(password, salt)

      let result = await db.register_user([isAdmin, username, hash])
      let user = result[0]

      req.session.user = user
      res.status(200).send(req.session.user)

    } catch (error) {
      console.log('error signing up', error)
        res.status(500).send(error)
    }
  },

  login: async (req, res) => {
    try {
      const db = req.app.get('db')
      const { username, password } = req.body
  
      let foundUser = await db.get_user([username])
      let user = foundUser[0]
  
      if (!user) {
        return res.status(401).send('User not found. Please register new user before logging in')
      }
  
      const isAuthenticated = bcrypt.compareSync(password, user.hash)
  
      if (!isAuthenticated) {
        return res.status(403).send('Incorrect Password')
      }
  
      req.session.user = { isAdmin: user.is_admin, id: user.id, username: user.username }
      return res.send(req.session.user)

    } catch (error) {
      console.log('error loggin in user', error)
      res.status(500).send(error)
    }
  }
}