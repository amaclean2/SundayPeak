import {
	RatingEmpty,
	RatingFull,
	RatingHalf,
	RatingQuarter,
	RatingThreeQuarter
} from 'Images/Symbols/RatingStars'
import React from 'react'

const RatingView = ({ ratingCount = 5, size }) => {
	const fullStars = Math.floor(ratingCount)
	const remainingStars = ratingCount - fullStars

	return (
		<div className={'rating-container flex-box'}>
			{Array(fullStars)
				.fill(1)
				.map((_, key) => (
					<RatingFull key={`rating_${key}`} size={size} />
				))}
			{remainingStars <= 0.25 && remainingStars > 0 && <RatingQuarter size={size} />}
			{remainingStars <= 0.5 && remainingStars > 0.25 && <RatingHalf size={size} />}
			{remainingStars <= 0.75 && remainingStars > 0.5 && <RatingThreeQuarter size={size} />}
			{remainingStars < 1 && remainingStars > 0.75 && <RatingFull size={size} />}
			{Array(Math.floor(5 - ratingCount))
				.fill(1)
				.map((_, idx) => (
					<RatingEmpty key={`half_rating_${idx}`} size={size} />
				))}
		</div>
	)
}

export default RatingView
