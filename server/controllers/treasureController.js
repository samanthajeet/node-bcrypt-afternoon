

module.exports = {
  dragonTreasure: async (req, res) => {
      const db = req.app.get('db')
      let response = await db.get_dragon_treasure([1])
      res.status(200).send(response)
    
  }
}