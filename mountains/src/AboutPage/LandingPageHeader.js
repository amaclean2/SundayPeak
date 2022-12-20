import { Link } from 'react-router-dom'
import { Button, FlexSpacer, MobileMenu } from '../Components/Reusable'
import LogoInline from '../Images/Logos/LogoInline'
import getContent from '../TextContent'

import './styles.css'

const LandingPageHeader = () => {
	return (
		<header className='flex-box landing-header'>
			<Link
				className='landing-header-logo'
				to='/discover'
			>
				<LogoInline
					width={200}
					color={'green'}
				/>
			</Link>
			<FlexSpacer />
			<MobileMenu>
				<Link
					className='mobile-menu-button'
					to='/login'
				>
					{getContent('buttonText.login')}
				</Link>
				<Link
					className='mobile-menu-button'
					to='/signup'
				>
					{getContent('buttonText.signup')}
				</Link>
			</MobileMenu>
			<div className='action-buttons'>
				<Link to='/login'>
					<Button className='secondary-button'>{getContent('buttonText.login')}</Button>
				</Link>
				<Link to='/signup'>
					<Button className='secondary-button'>{getContent('buttonText.signup')}</Button>
				</Link>
			</div>
		</header>
	)
}

export default LandingPageHeader
