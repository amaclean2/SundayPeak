import { useState } from 'react'

import Header from './Header'
import Nav from './Nav'

const MetaPageContent = ({ children }) => {
	const [navOpen, setNavOpen] = useState(false)

	return (
		<div className='external-app-container'>
			<Header setNavOpen={setNavOpen} />
			{children}
			<Nav
				navOpen={navOpen}
				setNavOpen={setNavOpen}
			/>
		</div>
	)
}

export default MetaPageContent
