import { useState } from 'react'
import { FormField } from '../Reusable'

const Search = () => {
	const [searchText, setSearchText] = useState('')

	return (
		<div>
			<FormField
				value={searchText}
				onChange={(e) => setSearchText(e.target.value)}
				isEditable
				autoComplete={'off'}
				className={'search-bar'}
				placeholder={'Find an adventure or find a friend'}
				name={'search'}
				type={'text'}
			/>
		</div>
	)
}

export default Search
