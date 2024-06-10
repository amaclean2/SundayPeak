import cx from 'classnames'
import PropTypes from 'prop-types'
import { Field, FieldHeader, FieldValue } from '../Reusable'

const StatTemplate = ({ statLabel = '', statValue = '', onClick, selected }) => {
	return (
		<Field
			className={cx('stat-template', selected && 'selected')}
			onClick={onClick}
		>
			<FieldHeader text={statLabel} />
			<FieldValue className={'stat-field'}>{statValue}</FieldValue>
		</Field>
	)
}

StatTemplate.propTypes = {
	statLabel: PropTypes.string.isRequired,
	statValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	onClick: PropTypes.func,
	selected: PropTypes.bool
}

export default StatTemplate
