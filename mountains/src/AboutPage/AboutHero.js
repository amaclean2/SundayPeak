import { Button } from '../Components/Reusable'
import getContent from '../TextContent'

import './styles.css'

const heroImage =
	'https://storage.googleapis.com/sunday-application-images/site_images/TouringUp_600.png'

const AboutHero = () => {
	return (
		<section className='hero-panel about-page-panel flex-box'>
			<section className='left-section flex-box'>
				<h1 className='hero-text'>
					{getContent('aboutPage.heroTextLineOne')}
					<br />
					{getContent('aboutPage.heroTextLineTwo')}
				</h1>
				<Button
					id='hero-button-about-page'
					className='about-hero-button'
					type={'link'}
					direction='/discover'
				>
					{getContent('buttonText.heroButtonText')}
				</Button>
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
