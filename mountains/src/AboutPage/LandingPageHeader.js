import { Link } from 'react-router-dom'
import { Button, MobileMenu } from '../Components/Reusable'
import LogoInline from '../Images/LogoInline'
import getContent from '../TextContent'

import './styles.css'

const LandingPageHeader = () => {
	return (
		<div className='flex-box landing-header'>
			<Link
				className='landing-header-logo'
				to='/discover'
			>
				<LogoInline
					width={200}
					color={'green'}
				/>
			</Link>
			<div className='flex-spacer' />
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
		</div>
	)
}

export default LandingPageHeader
