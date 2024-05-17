import PropTypes from 'prop-types'
import { redirect, useNavigate } from 'react-router-dom'
import { useAdventureStateContext, useManipulateFlows } from '@amaclean2/sundaypeak-treewells'

import { DisplayCard, FieldProps } from 'Components/Reusable'

import Fields from './Fields'
import AdventureGallery from '../../Gallery'

const SkiApproachViewer = ({ menuContents }) => {
	const { currentAdventure } = useAdventureStateContext()
	const { closeAdventureView } = useManipulateFlows()
	const navigate = useNavigate()

	if (currentAdventure.adventure_name === 'New Adventure' && !currentAdventure.path?.length) {
		redirect(`/adventure/edit/skiApproach/${currentAdventure.id}`)
	}

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
			<Fields />
		</DisplayCard>
	)
}

SkiApproachViewer.propTypes = {
	menuContents: PropTypes.shape({
		fields: FieldProps
	})
}

export default SkiApproachViewer
