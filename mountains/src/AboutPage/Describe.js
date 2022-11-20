import { FlexSpacer } from '../Components/Reusable'
import getContent from '../TextContent'

export const ActivitiesSP = () => (
	<section className='about-page-panel flex-box description-panel invert-color flipped-align'>
		<FlexSpacer />
		<section className='description-text-box'>
			<h2 className='describe-header'>{getContent('aboutPage.descriptionHeader')}</h2>
			<span className='describe-paragraph'>{getContent('aboutPage.descriptionContent')}</span>
		</section>
	</section>
)

export const DescribeSP = () => (
	<section className='about-page-panel flex-box description-panel'>
		<section className='description-text-box'>
			<h2 className='describe-header'>{getContent('aboutPage.descriptionHeaderTwo')}</h2>
			<span className='describe-paragraph'>{getContent('aboutPage.descriptionContentTwo')}</span>
		</section>
		<FlexSpacer />
	</section>
)
