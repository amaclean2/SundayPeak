import { Button, FieldHeader, FooterButtons } from 'Components/Reusable'
import ClickWrapper from 'Components/Reusable/ClickWrapper'
import { useDeleteAdventure } from 'Hooks'
import { useAdventureStateContext } from 'Hooks/Providers'

const DeletePage = () => {
	const { adventureDispatch, currentAdventure } = useAdventureStateContext()
	const deleteAdventure = useDeleteAdventure()
	return (
		<div className={'click-wrapper flex-box'}>
			<ClickWrapper onClick={() => adventureDispatch({ type: 'toggleDeletePage' })}>
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
									adventureType: currentAdventure.adventure_type
								})
							}}
							id={`delete-adventure-${currentAdventure.id}`}
							className={'delete-button'}
						>
							Accept
						</Button>
						<Button
							onClick={() => adventureDispatch({ type: 'toggleDeletePage' })}
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
