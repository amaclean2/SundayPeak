import { Link } from 'react-router-dom'
import { Button } from '../Components/Reusable'
import { CARD_TYPES, useCardStateContext } from '../Providers'
import getContent from '../TextContent'
import './styles.css'

const heroImage = 'https://storage.googleapis.com/user-image-storage/SiteImages/TouringUp_600.png'

const AboutHero = () => {
	const { cardDispatch } = useCardStateContext()

	return (
		<section className='hero-panel about-page-panel flex-box'>
			<section className='left-section flex-box'>
				<h1 className='hero-text'>
					{getContent('aboutPage.heroTextLineOne')}
					<br />
					{getContent('aboutPage.heroTextLineTwo')}
				</h1>
				<Link to={'/discover'}>
					<Button
						id='hero-button-about-page'
						className='about-hero-button'
						onClick={() => cardDispatch({ type: 'openCard', payload: CARD_TYPES.signup })}
					>
						{getContent('buttonText.heroButtonText')}
					</Button>
				</Link>
			</section>
			<section className='right-section'>
				<img
					src={heroImage}
					className={'hero-image'}
					alt={''}
				/>
			</section>
		</section>
	)
}

export default AboutHero
