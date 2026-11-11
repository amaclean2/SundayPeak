const deleteSkiStatement =
  'DELETE s.* FROM ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id WHERE a.id = ?'
const deleteClimbStatement =
  'DELETE c.* FROM climb AS c INNER JOIN adventures AS a ON a.adventure_climb_id = c.id WHERE a.id = ?'
const deleteHikeStatement =
  'DELETE h.* FROM hike AS h INNER JOIN adventures AS a ON a.adventure_hike_id = h.id WHERE a.id = ?'
const deleteBikeStatement =
  'DELETE b.* FROM bike AS b INNER JOIN adventures AS a ON a.adventure_bike_id = b.id WHERE a.id = ?'
const deleteSkiApproachStatement =
  'DELETE sa.* FROM ski_approach AS sa INNER JOIN adventures As a ON a.ski_approach_id = sa.id WHERE a.id = ?'

module.exports = {
  deleteSkiStatement,
  deleteClimbStatement,
  deleteHikeStatement,
  deleteBikeStatement,
  deleteSkiApproachStatement
}
