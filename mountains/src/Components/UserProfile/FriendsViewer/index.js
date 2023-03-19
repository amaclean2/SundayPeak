import { useState } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useDebounce, useGetUser, useUserStateContext } from 'sundaypeak-treewells'

import { FieldHeader, FormField } from 'Components/Reusable'
import { Friend } from './Friend'

const FriendsViewer = ({ className }) => {
	const { workingUser } = useUserStateContext()
	const { searchForUsers } = useGetUser()
	const navigate = useNavigate()

	const [searchText, setSearchText] = useState('')
	const [searchResults, setSearchResults] = useState(null)

	// debounced so requests aren't overloaded
	const getSearchResults = useDebounce((search) => {
		if (search.length <= 3) return setSearchResults(null)

		searchForUsers({ search }).then((users) => {
			setSearchResults(users)
		})
	})

	const handleSearch = (event) => {
		setSearchText(event.target.value)
		getSearchResults(event.target.value)
	}

	return (
		<div className={cx(className, 'tick-list-container friend-list-container flex-box')}>
			<FieldHeader className='label-field'>Friends</FieldHeader>
			<FormField
				name='friends_search'
				value={searchText}
				isEditable
				onChange={handleSearch}
				className='friends-search'
				placeholder={'Find New Friends'}
				autoComplete={'off'}
				type={'text'}
			/>
			{workingUser.friends || searchResults?.length ? (
				<ul className='tick-list flex-box friend-list'>
					{((searchResults?.length && searchResults) || workingUser.friends).map((friend, key) => (
						<Friend
							onClick={() => {
								setSearchText('')
								setSearchResults(null)
								navigate(`/user/${friend.id}`)
							}}
							friend={friend}
							key={`user_friend_${key}`}
						/>
					))}
				</ul>
			) : null}
		</div>
	)
}

FriendsViewer.propTypes = {
	className: PropTypes.string
}

export default FriendsViewer
