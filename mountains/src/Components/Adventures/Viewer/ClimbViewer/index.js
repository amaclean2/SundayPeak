import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useAdventureStateContext, useManipulateFlows } from '@amaclean2/sundaypeak-treewells'

import { DisplayCard, FieldProps } from 'Components/Reusable'

import AdventureGallery from '../../Gallery'
import ClimbFields from './Fields'

const ClimbViewer = ({ menuContents }) => {
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
			<AdventureGallery />
			<ClimbFields />
		</DisplayCard>
	)
}

ClimbViewer.propTypes = {
	menuContents: PropTypes.shape({
		fields: FieldProps
	})
}

export default ClimbViewer
