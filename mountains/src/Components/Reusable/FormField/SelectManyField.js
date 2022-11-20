import cx from 'classnames'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

const SelectManyField = ({ className, options, onChange, name, value }) => {
	// selectManyState is the current selection of present fields
	const [selectManyState, setSelectManyState] = useState(value)

	const handleSelectManyState = (e) => {
		let newSelectionList

		if (selectManyState.includes(e.target.value)) {
			const index = selectManyState.indexOf(e.target.value)

			// remove item from array
			newSelectionList = [...selectManyState.slice(0, index), ...selectManyState.slice(index + 1)]
		} else {
			// add item to the end of the array
			newSelectionList = [...selectManyState, e.target.value]
		}

		onChange({ target: { name, value: newSelectionList } })
		setSelectManyState(newSelectionList)
	}

	useEffect(() => {
		if (typeof selectManyState === 'string') {
			setSelectManyState(!!selectManyState.length ? JSON.parse(selectManyState) : [])
		}
	}, [selectManyState])

	return (
		<div className={cx('form-field', 'select-many', 'flex-box', className)}>
			{options?.selectMany?.map((option, key) => (
				<label
					htmlFor={option.name}
					className={cx('select-many-option', 'flex-box')}
					key={`select_many_option_${key}`}
				>
					<input
						type='checkbox'
						name={option}
						id={option}
						value={key + 1}
						checked={selectManyState.includes((key + 1).toString())}
						className={'hidden-checkbox'}
						onChange={handleSelectManyState}
					/>
					<div className='select-many-illus' />
					{option}
				</label>
			))}
		</div>
	)
}

SelectManyField.propTypes = {
	className: PropTypes.string,
	options: PropTypes.shape({
		selectMany: PropTypes.array
	}),
	onChange: PropTypes.func,
	name: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
}

export default SelectManyField
