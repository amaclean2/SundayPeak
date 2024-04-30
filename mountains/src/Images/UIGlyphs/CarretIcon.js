import React from 'react'

export const CarretIcon = ({ color = '#000000', size = '14.142', className }) => (
	<svg
		width={size}
		height={size * (3 / 2)}
		fill={color}
		className={className}
	>
		<rect
			width='15'
			height='5'
			rx='2'
			transform='translate(10.607 21.213) rotate(-135)'
		/>
		<rect
			width='5'
			height='15'
			rx='2'
			transform='translate(3.536 14.142) rotate(-135)'
		/>
	</svg>
)
