import {
	RatingEmpty,
	RatingFull,
	RatingHalf,
	RatingQuarter,
	RatingThreeQuarter
} from 'Images/Symbols/RatingStars'
import React from 'react'

const RatingView = ({ ratingCount = 5 }) => {
	const fullStars = Math.floor(ratingCount)
	const remainingStars = ratingCount - fullStars

	return (
		<div className={'rating-container flex-box'}>
			{Array(fullStars)
				.fill(1)
				.map((_, key) => (
					<RatingFull key={`rating_${key}`} />
				))}
			{remainingStars <= 0.25 && remainingStars > 0 && <RatingQuarter />}
			{remainingStars <= 0.5 && remainingStars > 0.25 && <RatingHalf />}
			{remainingStars <= 0.75 && remainingStars > 0.5 && <RatingThreeQuarter />}
			{remainingStars < 1 && remainingStars > 0.75 && <RatingFull />}
			{Array(Math.floor(5 - ratingCount))
				.fill(1)
				.map(() => (
					<RatingEmpty />
				))}
		</div>
	)
}

export default RatingView
