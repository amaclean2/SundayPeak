import { useAdventureStateContext, useDeleteAdventure } from '@amaclean2/sundaypeak-treewells'

import { Button, FieldHeader, FooterButtons } from 'Components/Reusable'
import ClickWrapper from 'Components/Reusable/ClickWrapper'
import { useNavigate } from 'react-router-dom'

const DeletePage = () => {
	const { currentAdventure } = useAdventureStateContext()
	const { deleteAdventure, toggleDeletePage } = useDeleteAdventure()
	const navigate = useNavigate()
	
	return (
		<div className={'click-wrapper flex-box'}>
			<ClickWrapper onClick={toggleDeletePage}>
				<div className={'delete-page flex-box'}>
					<FieldHeader>{`Delete "${currentAdventure.adventure_name}"?`}</FieldHeader>
					<p>
						Make sure before deleting an activity. Once an activity is deleted, it cannot be undone.
					</p>
					<FooterButtons>
						<Button
							onClick={() => {
								deleteAdventure({
									adventureId: currentAdventure.id,
									adventureType: currentAdventure.adventure_type,
									adventureName: currentAdventure.adventure_name
								})
								navigate('/discover')
							}}
							id={`delete-adventure-${currentAdventure.id}`}
							className={'delete-button'}
						>
							Accept
						</Button>
						<Button
							onClick={toggleDeletePage}
							id={'cancel-delete-adventure'}
							className={'secondary-button'}
						>
							Cancel
						</Button>
					</FooterButtons>
				</div>
			</ClickWrapper>
		</div>
	)
}

export default DeletePage
