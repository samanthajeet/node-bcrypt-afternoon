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

  }
}