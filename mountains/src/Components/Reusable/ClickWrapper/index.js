import PropTypes from 'prop-types'

import './styles.css'

const ClickWrapper = ({ children, onClick }) => {
	const handleClick = (event) => {
		event.preventDefault()
		onClick(event)
	}

	return (
		<>
			<div
				className={'click-wrapper'}
				onClick={handleClick}
			/>
			{children}
		</>
	)
}

ClickWrapper.propTypes = {
	children: PropTypes.node,
	onClick: PropTypes.func.isRequired
}

export default ClickWrapper
