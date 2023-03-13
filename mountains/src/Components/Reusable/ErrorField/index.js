import { useRef } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { useAdventureStateContext, useUserStateContext } from 'Hooks/Providers'

import './styles.css'

export const ErrorField = ({ form, className }) => {
	const { loginError } = useUserStateContext()
	const { adventureError } = useAdventureStateContext()

	const error = useRef('')

	switch (form) {
		case 'login':
			error.current = loginError
			break
		case 'adventure':
			error.current = adventureError
			break
		default:
			error.current = ''
	}

	return (
		<div className={cx('error-field flex-box', className, !!error.current ? '' : 'collapsed')}>
			{error.current}
		</div>
	)
}

ErrorField.propTypes = {
	form: PropTypes.string.isRequired,
	className: PropTypes.string
}
