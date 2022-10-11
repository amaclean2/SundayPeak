import { Field, FieldHeader, FieldValue } from '../Reusable'

const StatTemplate = ({ statLabel = '', statValue = '' }) => {
	return (
		<Field className='stat-template'>
			<FieldHeader text={statLabel} />
			<FieldValue className={'stat-field'}>{statValue}</FieldValue>
		</Field>
	)
}

export default StatTemplate
