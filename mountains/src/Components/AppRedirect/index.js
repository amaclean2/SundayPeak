import LogoInline from 'Images/Logos/LogoInline'

import './styles.css'
import { Button, FlexSpacer } from 'Components/Reusable'
import { AppStoreBadge } from 'Images/Logos/AppStoreBadge'

const AppRedirect = () => {
	return (
		<div className='flex-box mobile-page'>
			<FlexSpacer />
			<LogoInline
				width={300}
				color={'green'}
			/>
			<div>
				The Sunday Peak app is here!
				<p>For use on a mobile device, check us out on the app store.</p>
			</div>
			<Button
				direction='https://apps.apple.com/us/app/sunday-peak/id6469585117'
				className={'app-store-button'}
			>
				<AppStoreBadge />
			</Button>
			{/* <div>Check out our developer blog for status updates.</div> */}
			<FlexSpacer />
		</div>
	)
}

export default AppRedirect
