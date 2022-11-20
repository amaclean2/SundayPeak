import { Link } from 'react-router-dom'
import { Button } from '../Components/Reusable'
import LogoInline from '../Images/LogoInline'
import getContent from '../TextContent'

import './styles.css'

const LandingPageHeader = () => {
	return (
		<div className='flex-box landing-header'>
			<LogoInline
				width={200}
				color={'green'}
			/>
			<div className='flex-spacer' />
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
