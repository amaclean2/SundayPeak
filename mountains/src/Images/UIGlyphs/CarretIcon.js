import React from 'react'

export const CarretIcon = ({ color = '#000000', size = '21.213', className }) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width={size}
		height={size}
		viewBox='0 0 21.213 21.213'
		className={className}
		fill={color}
	>
		<g
			id='Carret'
			transform='translate(10.607) rotate(45)'
		>
			<rect
				id='Rectangle_1'
				data-name='Rectangle 1'
				width='15'
				height='5'
				rx='2'
			/>
			<rect
				id='Rectangle_2'
				data-name='Rectangle 2'
				width='5'
				height='15'
				rx='2'
				transform='translate(10)'
			/>
		</g>
	</svg>
)
