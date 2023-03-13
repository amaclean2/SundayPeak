import cx from 'classnames'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Button } from '../Button'
import ClickWrapper from '../ClickWrapper'

const SelectManyField = ({ className, options, onChange, name, value }) => {
	// selectManyState is the current selection of present fields
	const [selectManyState, setSelectManyState] = useState(value.length ? JSON.parse(value) : [])
	const [menuOpen, setMenuOpen] = useState(false)

	const handleSelectManyState = (event) => {
		const tempState = [...selectManyState]
		tempState[event.target.value] = !tempState[event.target.value]
		setSelectManyState(tempState)
		onChange({ target: { name, value: JSON.stringify(tempState) } })
	}

	useEffect(() => {
		if (!selectManyState.length) {
			setSelectManyState(Array(options.selectMany.length).fill(false))
		}
	}, [])

	return (
		<div className={cx('form-field select-many full-width', className)}>
			<Button
				className={'select-many-button secondary-button'}
				onClick={() => setMenuOpen(true)}
			>
				<span>
					{options.selectMany
						.filter((_, key) => selectManyState[key])
						.map((option) => option)
						.join(', ')}
				</span>
			</Button>
			{menuOpen && (
				<ClickWrapper onClick={() => setMenuOpen(false)}>
					<div className={'select-many-options-selector flex-box full-width'}>
						{options?.selectMany?.map((option, key) => (
							<label
								htmlFor={option}
								className={'select-many-option flex-box'}
								key={`select_many_option_${key}`}
							>
								<input
									type='checkbox'
									name={option}
									id={option}
									value={key}
									checked={selectManyState[key]}
									className={'hidden-checkbox'}
									onChange={handleSelectManyState}
								/>
								<div className='select-many-illus' />
								{option}
							</label>
						))}
					</div>
				</ClickWrapper>
			)}
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
	value: PropTypes.string
}

export default SelectManyField
