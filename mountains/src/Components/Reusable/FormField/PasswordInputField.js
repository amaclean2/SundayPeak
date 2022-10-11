import { useState } from 'react'
import cx from 'classnames'

import { Button } from '../Button'
import { placeholderDefinition } from './utils'

const PasswordInputField = ({
	className,
	name,
	label,
	hideLabel,
	placeholder,
	value,
	onChange,
	autoComplete = 'off'
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
				type={passwordShown ? 'text' : 'password'}
				name={name}
				id={name}
				autoComplete={autoComplete}
				placeholder={placeholderDefinition({ placeholder, hideLabel, label })}
				value={value}
				onChange={onChange}
			/>
			<Button
				className='password-switch-field'
				onClick={() => setPasswordShown(!passwordShown)}
			>
				{passwordShown ? 'Hide' : 'Show'}
			</Button>
		</div>
	)
}

export default PasswordInputField
