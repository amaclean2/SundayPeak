import PropTypes from 'prop-types'

export const Friend = ({ friend, onClick }) => (
	<li
		onClick={onClick}
		className='tick drop-list-item flex-box'
	>
		{friend.display_name}
	</li>
)

Friend.propTypes = {
	friend: PropTypes.shape({
		user_id: PropTypes.number.isRequired,
		display_name: PropTypes.string.isRequired,
		email: PropTypes.string
	}),
	onClick: PropTypes.func
}
