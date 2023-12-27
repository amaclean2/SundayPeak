import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '../Button'
import { RatingCircleEmpty, RatingCircleFull } from 'Images/Symbols/Rating'

import './style.css'

const RatingSelector = ({ title = 'Rating', rating, setRating, color = 'green' }) => {
	return (
		<div className={'rating-selector'}>
			<p>{title}</p>
			<div className={'flex-box rating-group'}>
				<Button
					className={'rating-icon'}
					onClick={() => setRating(1)}
				>
					{rating > 0 ? <RatingCircleFull color={color} /> : <RatingCircleEmpty />}
				</Button>
				<Button
					className={'rating-icon'}
					onClick={() => setRating(2)}
				>
					{rating > 1 ? <RatingCircleFull color={color} /> : <RatingCircleEmpty />}
				</Button>
				<Button
					className={'rating-icon'}
					onClick={() => setRating(3)}
				>
					{rating > 2 ? <RatingCircleFull color={color} /> : <RatingCircleEmpty />}
				</Button>
				<Button
					className={'rating-icon'}
					onClick={() => setRating(4)}
				>
					{rating > 3 ? <RatingCircleFull color={color} /> : <RatingCircleEmpty />}
				</Button>
				<Button
					className={'rating-icon'}
					onClick={() => setRating(5)}
				>
					{rating > 4 ? <RatingCircleFull color={color} /> : <RatingCircleEmpty />}
				</Button>
			</div>
		</div>
	)
}

RatingSelector.propTypes = {
	title: PropTypes.string,
	rating: PropTypes.number,
	setRating: PropTypes.func,
	color: PropTypes.oneOf(['green', 'blue'])
}

export default RatingSelector
