// update adventure property
const updateAdventureGeneralStatement =
  'UPDATE `adventures` SET ?? = ? WHERE id = ?'
const updateSpecificStatements = {
  ski: 'UPDATE `ski` SET ?? = ? WHERE id = (SELECT adventure_ski_id FROM adventures WHERE id = ?)',
  climb:
    'UPDATE `climb` SET ?? = ? WHERE id = (SELECT adventure_climb_id FROM adventures WHERE id = ?)',
  hike: 'UPDATE `hike` SET ?? = ? WHERE id = (SELECT adventure_hike_id FROM adventures WHERE id = ?)',
  bike: 'UPDATE `bike` set ?? = ? WHERE id = (SELECT adventure_bike_id FROM adventures WHERE id = ?)',
  skiApproach:
    'UPDATE `ski_approach` SET ?? = ? WHERE id = (SELECT ski_approach_id FROM adventures WHERE id = ?)'
}

const updateAdventureStatements = {
  avg_angle:
    'UPDATE ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id SET s.avg_angle = ? WHERE a.id = ?',
  max_angle:
    'UPDATE ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id SET s.max_angle = ? WHERE a.id = ? ',
  aspect:
    'UPDATE ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id SET s.aspect = ? WHERE a.id = ?',
  bio: 'UPDATE adventures SET bio = ? WHERE id = ?',
  climb_approach:
    'UPDATE climb AS c INNER JOIN adventures AS a ON a.adventure_climb_id = c.id SET c.approach = ? WHERE a.id = ?',
  climb_type:
    'UPDATE climb AS c INNER JOIN adventures AS a ON a.adventure_climb_id = c.id SET c.climb_type = ? WHERE a.id = ?',
  ski_summit_elevation:
    'UPDATE ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id SET s.summit_elevation = ? WHERE a.id = ?',
  hike_summit_elevation:
    'UPDATE hike AS h INNER JOIN adventures AS a ON a.adventure_hike_id = h.id SET h.summit_elevation = ? WHERE a.id = ?',
  bike_summit_elevation:
    'UPDATE bike AS b INNER JOIN adventures AS a ON a.adventure_hike_id = b.id SET b.summit_elevation = ? WHERE a.id = ?',
  ski_approach_summit_elevation:
    'UPDATE ski_approach AS sa INNER JOIN adventures AS a ON a.ski_approach_id = sa.id SET sa.summit_elevation = ? WHERE a.id = ?',
  ski_exposure:
    'UPDATE ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id SET s.exposure = ? WHERE a.id = ?',
  approach_exposure:
    'UPDATE ski_approach AS sa INNER JOIN adventures AS a ON a.ski_approach_id = sa.id SET sa.exposure = ? WHERE a.id = ?',
  first_ascent:
    'UPDATE climb AS c INNER JOIN adventures AS a ON a.adventure_climb_id = c.id SET c.first_ascent = ? WHERE a.id = ?',
  ski_base_elevation:
    'UPDATE ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id SET s.base_elevation = ? WHERE a.id = ?',
  hike_base_elevation:
    'UPDATE hike AS h INNER JOIN adventures AS a ON a.adventure_hike_id = h.id SET h.base_elevation = ? WHERE a.id = ?',
  bike_base_elevation:
    'UPDATE bike AS b INNER JOIN adventures AS a ON a.adventure_bike_id = b.id SET b.base_elevation = ? WHERE a.id = ?',
  ski_approach_base_elevation:
    'UPDATE ski_approach AS sa INNER JOIN adventures AS a ON a.ski_approach_id = sa.id SET sa.base_elevation = ? WHERE a.id = ?',
  gear: 'UPDATE ski_approach AS sa INNER JOIN adventures AS a ON a.ski_approach_id = sa.id SET sa.gear = ? WHERE a.id = ?',
  grade:
    'UPDATE climb AS c INNER JOIN adventures AS a ON a.adventure_climb_id = c.id SET c.grade = ? WHERE a.id = ?',
  light_times:
    'UPDATE climb AS c INNER JOIN adventures AS a ON a.adventure_climb_id = c.id SET c.light_times WHERE a.id = ?',
  nearest_city: 'UPDATE adventures SET nearest_city = ? WHERE id = ?',
  pitches:
    'UPDATE climb AS c INNER JOIN adventures AS a ON a.adventure_climb_id = c.id SET c.pitches = ? WHERE a.id = ?',
  protection:
    'UPDATE climb AS c INNER JOIN adventures AS a ON a.adventure_climb_id = c.id SET c.protection = ? WHERE a.id = ?',
  public: 'UPDATE adventures SET public = ? WHERE id = ?',
  rating: 'UPDATE adventures SET rating = ? WHERE id = ?',
  ski_season:
    'UPDATE ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id SET s.season = ? WHERE a.id = ?',
  climb_season:
    'UPDATE climb AS c INNER JOIN adventures AS a ON a.adventure_climb_id = c.id SET c.season = ? WHERE a.id = ?',
  hike_season:
    'UPDATE hike AS h INNER JOIN adventures AS a ON a.adventure_hike_id = h.id SET h.season = ? WHERE a.id = ?',
  bike_season:
    'UPDATE bike AS b INNER JOIN adventures AS a ON a.adventure_bike_id = b.id SET b.season = ? WHERE a.id = ?',
  ski_trail_path:
    'UPDATE ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id SET s.trail_path = ?, s.elevations = ?, s.summit_elevation = ?, s.base_elevation = ? WHERE a.id = ?',
  hike_trail_path:
    'UPDATE hike AS h INNER JOIN adventures AS a ON a.adventure_hike_id = h.id SET h.trail_path = ?, h.elevations = ?, h.summit_elevation = ?, h.base_elevation = ?, h.climb = ?, h.descent = ? WHERE a.id = ?',
  bike_trail_path:
    'UPDATE bike AS b INNER JOIN adventures AS a ON a.adventure_bike_id = b.id SET b.trail_path = ?, b.elevations = ?, b.summit_elevation = ?, b.base_elevation = ?, b.climb = ?, b.descent = ? WHERE a.id = ?',
  ski_approach_trail_path:
    'UPDATE ski_approach AS sa INNER JOIN adventures AS a ON a.ski_approach_id = sa.id SET sa.trail_path = ?, sa.elevations = ?, sa.summit_elevation = ?, sa.base_elevation = ? WHERE a.id = ?',
  remove_ski_trail_path: `UPDATE ski AS s INNER JOIN adventures AS a ON a.adventure_ski_id = s.id SET s.trail_path = "[]", s.elevations = "[]" WHERE a.id = ?`,
  remove_hike_trail_path: `UPDATE hike AS h INNER JOIN adventures AS a ON a.adventure_hike_id = h.id SET h.trail_path = "[]", h.elevations = "[]" WHERE a.id = ?`,
  remove_bike_trail_path: `UPDATE bike AS b INNER JOIN adventures AS a ON a.adventure_bike_id = b.id SET b.trail_path = "[]", b.elevations = "[]" WHERE a.id = ?`,
  remove_ski_approach_trail_path: `UPDATE ski_approach AS sa INNER JOIN adventures AS a ON a.ski_approach_id = sa.id SET sa.trail_path = "[]", sa.elevations = "[]" WHERE a.id = ?`,
  hike_climb:
    'UPDATE hike AS h INNER JOIN adventures AS a ON a.adventure_hike_id = h.id SET h.climb = ? WHERE a.id = ?',
  hike_descent:
    'UPDATE hike AS h INNER JOIN adventures AS a ON a.adventure_hike_id = h.id SET h.descent = ? WHERE a.id = ?',
  bike_climb:
    'UPDATE bike AS b INNER JOIN adventures AS a ON a.adventure_bike_Id = b.id SET b.climb = ? WHERE a.id = ?',
  bike_descent:
    'UPDATE bike AS b INNER JOIN adventures AS a ON a.adventure_bike_Id = b.id SET b.descent = ? WHERE a.id = ?'
}

module.exports = {
  updateAdventureStatements,
  updateAdventureGeneralStatement,
  updateSpecificStatements
}
