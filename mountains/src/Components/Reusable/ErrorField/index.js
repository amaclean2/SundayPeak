import { useRef } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { useAdventureStateContext, useUserStateContext } from '@amaclean2/sundaypeak-treewells'

import './styles.css'

export const ErrorField = ({ form, className, testId }) => {
	const { userError } = useUserStateContext()
	const { adventureError } = useAdventureStateContext()

	const error = useRef('')

	switch (form) {
		case 'login':
			error.current = userError
			break
		case 'adventure':
			error.current = adventureError
			break
		default:
			error.current = ''
	}

	return (
		<div
			className={cx('error-field flex-box', className, !!error.current ? '' : 'collapsed')}
			data-testid={testId}
		>
			{error.current}
		</div>
	)
}

ErrorField.propTypes = {
	form: PropTypes.string.isRequired,
	className: PropTypes.string,
	testId: PropTypes.string
}
