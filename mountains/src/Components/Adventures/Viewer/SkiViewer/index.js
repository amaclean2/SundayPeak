import PropTypes from 'prop-types'
import { redirect, useNavigate } from 'react-router-dom'
import { useAdventureStateContext, useManipulateFlows } from '@amaclean2/sundaypeak-treewells'

import { DisplayCard, FieldProps } from 'Components/Reusable'

import Fields from './Fields'

const SkiViewer = ({ menuContents }) => {
	const { currentAdventure } = useAdventureStateContext()
	const { closeAdventureView } = useManipulateFlows()
	const navigate = useNavigate()

	if (currentAdventure.adventure_name === 'New Adventure' && !currentAdventure.path?.length) {
		redirect(`/adventure/edit/ski/${currentAdventure.id}`)
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
			<Fields menuContents={menuContents} />
		</DisplayCard>
	)
}

SkiViewer.propTypes = {
	menuContents: PropTypes.shape({
		fields: FieldProps
	})
}

export default SkiViewer
