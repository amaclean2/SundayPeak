import React from 'react'

const BreadcrumbSeparator = ({ color = '#02AD85' }) => {
	return (
		<svg
			width='8.485'
			height='12.785'
			viewBox='0 0 8.485 12.785'
			fill={color}
		>
			<g transform='translate(8.485 12.785) rotate(180)'>
				<rect
					width='9'
					height='3'
					rx='1.5'
					transform='translate(6.364 12.785) rotate(-135)'
				/>
				<rect
					width='3'
					height='9'
					rx='1.5'
					transform='translate(2.121 8.485) rotate(-135)'
				/>
			</g>
		</svg>
	)
}

export default BreadcrumbSeparator
