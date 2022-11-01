import { FlexSpacer } from '../Components/Reusable'

export const ActivitiesSP = () => (
	<section className='about-page-panel flex-box description-panel invert-color flipped-align'>
		<FlexSpacer />
		<section className='description-text-box'>
			<h2 className='describe-header'>Any adventure you want, you can find it here.</h2>
			<span className='describe-paragraph'>
				In the winter, it's ski season. In the summer maybe it's time to go for a hike or a climb.
				We're supporting more and more activities every day. Check out a new activity you might want
				to do or grab a buddy and ride that flow trail.
			</span>
		</section>
	</section>
)

export const DescribeSP = () => (
	<section className='about-page-panel flex-box description-panel'>
		<section className='description-text-box'>
			<h2 className='describe-header'>Take your friends to play outside.</h2>
			<span className='describe-paragraph'>
				We're here to make it easier to get outside. Whether you're looking for a place to go hiking
				this weekend or you're trying to find a friend to send that 12a project, Sunday Peak is here
				to help you get out and get started.
			</span>
		</section>
		<FlexSpacer />
	</section>
)
