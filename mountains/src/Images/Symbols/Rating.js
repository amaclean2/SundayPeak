export const RatingCircleEmpty = () => {
	return (
		<svg
			width='32'
			height='32'
			viewBox='0 0 22 22'
		>
			<path
				d='M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,2a9,9,0,1,0,9,9A9.01,9.01,0,0,0,11,2Z'
				fill='#8b8b8b'
			/>
		</svg>
	)
}

export const RatingCircleFull = ({ color = 'green' }) => {
	return (
		<svg
			width='32'
			height='32'
			viewBox='0 0 22 22'
		>
			<circle
				id='Ellipse_25'
				cx='11'
				cy='11'
				r='11'
				fill={color === 'green' ? '#02ad85' : '#007f98'}
			/>
		</svg>
	)
}
