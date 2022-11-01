import './styles.css'

import LandingPageHeader from './LandingPageHeader'
import { ActivitiesSP, DescribeSP } from './Describe'
import AboutFooter from './Footer'
import AboutHero from './AboutHero'

const AboutPage = () => {
	return (
		<>
			<LandingPageHeader />
			<AboutHero />
			<DescribeSP />
			<ActivitiesSP />
			<AboutFooter />
		</>
	)
}

export default AboutPage
