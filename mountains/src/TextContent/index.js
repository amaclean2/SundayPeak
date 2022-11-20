import { adventurePanel } from './adventures'
import { aboutPage } from './aboutPage'
import { buttonText } from './buttonText'
import { lists } from './lists'

const textContent = {
	aboutPage,
	buttonText,
	adventurePanel,
	lists
}

const getContent = (textContentKey, replacementStrings) => {
	const keys = textContentKey.split('.')
	let parent = textContent

	for (const key of keys) {
		if (typeof parent !== 'string') {
			parent = parent[key]
		}
	}

	if (replacementStrings?.length && parent.includes('{var}')) {
		for (const string in replacementStrings) {
			parent.replace('{var}', string)
		}
	}

	return parent
}

export default getContent
