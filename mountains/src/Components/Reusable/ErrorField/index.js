import { useEffect, useState } from 'react'
import cx from 'classnames'

import { useAdventureEditContext, useUserStateContext } from '../../../Providers'

import './styles.css'

export const ErrorField = ({ form, className }) => {
	const { loginError } = useUserStateContext()
	const { adventureError } = useAdventureEditContext()
	const [error, setError] = useState('')

	useEffect(() => {
		switch (form) {
			case 'login':
				setError(loginError)
				break
			case 'adventure':
				setError(adventureError)
				break
			default:
				setError('')
				break
		}
	}, [loginError, adventureError, form])

	return (
		<span className={cx('error-field flex-box', className, !!error ? '' : 'collapsed')}>
			{error}
		</span>
	)
}
