import { Link } from 'react-router-dom'
import { Button } from '../Components/Reusable'
import { CARD_TYPES, useCardStateContext } from '../Providers'
import './styles.css'

const heroImage =
	'https://storage.googleapis.com/backyard-image-storage/SiteImages/TouringUp_600.png'

const AboutHero = () => {
	const { openCard } = useCardStateContext()
	return (
		<section className='hero-panel about-page-panel flex-box'>
			<section className='left-section flex-box'>
				<h1 className='hero-text'>
					Find an adventure. Find a friend.
					<br />
					Play outside. Repeat.
				</h1>
				<Link to={'/discover'}>
					<Button
						id='hero-button-about-page'
						className='about-hero-button'
						onClick={() => openCard(CARD_TYPES.signup)}
					>
						Get Started
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
