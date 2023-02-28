const MobileMenuHeader = ({ handleClose }) => {
	return (
		<div
			className='mobile-menu-header flex-box'
			onClick={handleClose}
		>
			<div className='open-icon' />
		</div>
	)
}

export default MobileMenuHeader
