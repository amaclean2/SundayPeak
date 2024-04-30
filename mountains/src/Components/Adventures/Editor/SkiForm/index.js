import { useAdventureStateContext, useDeleteAdventure } from '@amaclean2/sundaypeak-treewells'

import { Button, DisplayCard, FooterButtons } from 'Components/Reusable'
import DeletePage from '../DeletePage'
import SkiFields from './Fields'
import AddPath from './AddPath'

const SkiForm = ({ menuContents }) => {
	const { currentAdventure, isDeletePageOpen } = useAdventureStateContext()
	const { toggleDeletePage } = useDeleteAdventure()

	const showAddPath =
		currentAdventure.adventure_name === 'New Adventure' && !currentAdventure.path?.length

	return (
		<DisplayCard
			title={currentAdventure.adventure_name || 'New Adventure'}
			menu={menuContents}
		>
			{showAddPath ? <AddPath /> : <SkiFields />}
			<FooterButtons>
				{!showAddPath && (
					<Button
						direction={`/adventure/${currentAdventure.adventure_type}/${currentAdventure.id}`}
					>
						Finish
					</Button>
				)}
				<Button
					className={'delete-button'}
					id={'adventure-delete-button'}
					onClick={toggleDeletePage}
				>
					Delete Adventure
				</Button>
			</FooterButtons>
			{isDeletePageOpen && <DeletePage />}
		</DisplayCard>
	)
}

export default SkiForm
