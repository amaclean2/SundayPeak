import cx from 'classnames'
import { useEffect, useState } from 'react'

const SelectManyField = ({ className, options, onChange, name, value }) => {
	const [selectManyState, setSelectManyState] = useState([])

	const handleSelectManyState = (e) => {
		if (selectManyState.includes(e.target.value)) {
			const index = selectManyState.indexOf(e.target.value)

			// remove item from array
			setSelectManyState((currArray) => {
				return [...currArray.slice(0, index), ...currArray.slice(index + 1)]
			})
		} else {
			// add item to the end of the array
			setSelectManyState([...selectManyState, e.target.value])
		}
	}

	useEffect(() => {
		onChange({
			target: {
				name,
				value: selectManyState
			}
		})
	}, [selectManyState])

	useEffect(() => {
		if (typeof value === 'string') {
			setSelectManyState(!!value.length ? JSON.parse(value) : [])
		} else {
			setSelectManyState(value)
		}
	}, [])

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
						name={option.name}
						id={option.name}
						value={option.value}
						checked={selectManyState.includes(key + 1)}
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

export default SelectManyField
