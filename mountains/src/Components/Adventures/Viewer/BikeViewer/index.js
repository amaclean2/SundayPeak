import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useAdventureStateContext, useManipulateFlows } from '@amaclean2/sundaypeak-treewells'

import { DisplayCard, FieldProps } from 'Components/Reusable'

import Fields from './Fields'

const BikeViewer = ({ menuContents }) => {
	const { currentAdventure } = useAdventureStateContext()
	const { closeAdventureView } = useManipulateFlows()
	const navigate = useNavigate()

	return (
		<DisplayCard
			title={currentAdventure.adventure_name}
			menu={menuContents}
			onClose={() => {
				navigate('/discover')
				closeAdventureView()
			}}
		>
			<Fields menuContents={menuContents} />
		</DisplayCard>
	)
}

BikeViewer.propTypes = {
	menuContents: PropTypes.shape({
		fields: FieldProps
	})
}

export default BikeViewer
