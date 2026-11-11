const Router = require('express')
const {
  handleUserSearch,
  handleAdventureSearch,
  handleZoneSearch
} = require('../../Handlers/Search')

const router = Router()

router.get('/users', handleUserSearch)
router.get('/adventures', handleAdventureSearch)
router.get('/zones', handleZoneSearch)

module.exports = router
