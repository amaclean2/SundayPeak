import LogoInline from 'Images/Logos/LogoInline'

import './styles.css'
import { FlexSpacer } from 'Components/Reusable'

const AppRedirect = () => {
	return (
		<div className='flex-box mobile-page'>
			<FlexSpacer />
			<LogoInline
				width={300}
				color={'green'}
			/>
			<div>Sorry, we don't have a mobile version of Sunday Peak yet.</div>
			<div>We are working on a mobile app coming soon.</div>
			{/* <div>Check out our developer blog for status updates.</div> */}
			<FlexSpacer />
		</div>
	)
}

export default AppRedirect
