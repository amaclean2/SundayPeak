export const formatAdventureForExport = (oldObject, attachString = null) => {
	let newObject = {}

	for (const property in oldObject) {
		if (typeof oldObject[property] === 'function') {
			throw new Error('no functions allowed in export')
		} else if (typeof oldObject[property] === 'object') {
			newObject = { ...newObject, ...formatAdventureForExport(oldObject[property], property) }
		} else {
			newObject[attachString ? `${attachString}.${property}` : property] = oldObject[property]
		}
	}
	return newObject
}

/**
 * {
 *  a: 1,
 *  b: 2,
 *  c: {
 *    d: 3,
 *    e: {
 *      f: 4
 *    }
 *  }
 * }
 */
