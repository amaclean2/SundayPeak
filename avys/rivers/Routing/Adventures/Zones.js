const { Router } = require('express')
const {
  getAllZones,
  getZone,
  createZone,
  addChild,
  editMetaData,
  removeChild,
  deleteZone,
  getZonesByDistance
} = require('../../Handlers/Zones')
const {
  zoneCreateValidator,
  zoneEditValidator
} = require('../../Validators/ZoneValidators')

const router = Router()

router.get('/all', getAllZones)
router.get('/details', getZone)
router.get('/distance', getZonesByDistance)
router.post('/', zoneCreateValidator(), createZone)
router.post('/child', addChild)
router.put('/', zoneEditValidator(), editMetaData)
router.delete('/child', removeChild)
router.delete('/', deleteZone)

module.exports = router
