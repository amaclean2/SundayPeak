import { Button, FlexSpacer } from '../Components/Reusable'
import LogoInline from '../Images/Logos/LogoInline'
import getContent from '../TextContent'

import './styles.css'

const LandingPageHeader = () => {
	return (
		<header className='flex-box landing-header'>
			<Button
				className='landing-header-logo'
				type='link'
				direction='/discover'
			>
				<LogoInline
					width={200}
					color={'green'}
				/>
			</Button>
			<FlexSpacer />
			<div className='action-buttons'>
				<Button
					type='link'
					direction='/login'
					className='secondary-button'
				>
					{getContent('buttonText.login')}
				</Button>
				<Button
					type='link'
					direction='/signup'
					className='secondary-button'
				>
					{getContent('buttonText.signup')}
				</Button>
			</div>
		</header>
	)
}

export default LandingPageHeader
