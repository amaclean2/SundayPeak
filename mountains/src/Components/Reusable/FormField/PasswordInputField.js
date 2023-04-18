import { useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { Button } from '../Button'
import { placeholderDefinition } from './utils'
import getContent from '../../../TextContent'

const PasswordInputField = ({
	className,
	name,
	label,
	hideLabel,
	placeholder,
	value,
	onChange,
	testId,
	autoComplete = 'off',
	autoFocus = false
}) => {
	const [passwordFocus, setPasswordFocus] = useState(false)
	const [passwordShown, setPasswordShown] = useState(false)

	return (
		<div
			className={cx('password', 'form-field', 'flex-box', passwordFocus && 'focus', className)}
			onFocus={() => setPasswordFocus(true)}
			onBlur={() => setPasswordFocus(false)}
		>
			<input
				className={'password-input-field'}
				data-testid={testId}
				type={passwordShown ? 'text' : 'password'}
				name={name}
				id={name}
				autoComplete={autoComplete}
				placeholder={placeholderDefinition({ placeholder, hideLabel, label })}
				value={value}
				onChange={onChange}
				autoFocus={autoFocus}
			/>
			<Button
				className='password-switch-field'
				onClick={() => setPasswordShown(!passwordShown)}
			>
				{passwordShown ? getContent('buttonText.hide') : getContent('buttonText.show')}
			</Button>
		</div>
	)
}

PasswordInputField.propTypes = {
	className: PropTypes.string,
	name: PropTypes.string,
	label: PropTypes.string,
	hideLabel: PropTypes.bool,
	placeholder: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func,
	autoComplete: PropTypes.string,
	autoFocus: PropTypes.bool
}

export default PasswordInputField
