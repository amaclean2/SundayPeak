import React from 'react'

export const CheckboxChecked = ({ color = '#02ad85' }) => {
	return (
		<svg
			width='19'
			height='19'
			viewBox='0 0 19 19'
		>
			<path
				d='M-284.893-371h-11a4.005,4.005,0,0,1-4-4v-11a4,4,0,0,1,4-4h11a4,4,0,0,1,4,4v11A4,4,0,0,1-284.893-371Zm-11-17a2,2,0,0,0-2,2v11a2,2,0,0,0,2,2h11a2,2,0,0,0,2-2v-11a2,2,0,0,0-2-2Z'
				transform='translate(299.893 390)'
				fill={color}
			/>
			<rect
				width='8'
				height='3'
				rx='1'
				transform='translate(4.528 7.364) rotate(45)'
				fill={color}
			/>
			<rect
				width='3'
				height='12'
				rx='1'
				transform='translate(14.428 4.535) rotate(45)'
				fill={color}
			/>
		</svg>
	)
}

export const CheckboxEmpty = ({ color = '#666666' }) => (
	<svg
		width='19'
		height='19'
		viewBox='0 0 19 19'
	>
		<path
			d='M-284.893-341h-11a4,4,0,0,1-4-4v-11a4,4,0,0,1,4-4h11a4,4,0,0,1,4,4v11A4,4,0,0,1-284.893-341Zm-11-17a2,2,0,0,0-2,2v11a2,2,0,0,0,2,2h11a2,2,0,0,0,2-2v-11a2,2,0,0,0-2-2Z'
			transform='translate(299.893 360)'
			fill={color}
		/>
	</svg>
)
