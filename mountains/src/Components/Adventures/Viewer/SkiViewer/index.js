import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { useAdventureStateContext, useManipulateFlows } from '@amaclean2/sundaypeak-treewells'

import { DisplayCard, FieldProps } from 'Components/Reusable'
import AdventureGallery from 'Components/Adventures/Gallery'

import Fields from './Fields'

const SkiViewer = ({ menuContents }) => {
	const { currentAdventure } = useAdventureStateContext()
	const { closeAdventureView } = useManipulateFlows()
	const navigate = useNavigate()

	if (currentAdventure.adventure_name === 'New Adventure' && !currentAdventure.path?.length) {
		navigate(`/adventure/edit/ski/${currentAdventure.id}`)
	}

	return (
		<DisplayCard
			title={currentAdventure.adventure_name}
			menu={menuContents}
			onClose={() => {
				closeAdventureView()
				navigate('/discover')
			}}
		>
			<AdventureGallery />
			<Fields />
		</DisplayCard>
	)
}

SkiViewer.propTypes = {
	menuContents: PropTypes.shape({
		fields: FieldProps
	})
}

export default SkiViewer
