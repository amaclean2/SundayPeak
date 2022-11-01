import { Field, FieldHeader, FieldValue } from '../Reusable'

const StatTemplate = ({ statLabel = '', statValue = '', onClick }) => {
	return (
		<Field
			className='stat-template'
			onClick={onClick}
		>
			<FieldHeader text={statLabel} />
			<FieldValue className={'stat-field'}>{statValue}</FieldValue>
		</Field>
	)
}

export default StatTemplate
