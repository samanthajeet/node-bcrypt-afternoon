const bcrypt = require('bcryptjs')

module.exports = {
  register: async (req, res) => {
    try {
      const db = req.app.get('db')
      const { username, password, isAdmin } = req.body

      let usernameResponse = await db.get_user([username])

      if (usernameResponse [0]){
        res.status(409).send('Username taken')
      }

      let salt = bcrypt.genSaltSync(10)
      let hash = bcrypt.hashSync(password, salt)

      let result = await db.register_user([isAdmin, username, hash])
      const user = result[0]

      req.session.user = {isAdmin: user.is_admin, id: user.id, username: user.username}
      res.status(200).send(req.session.user)

    } catch (error) {
      console.log('error signing up', error)
        res.status(500).send(error)
    }

  }
}