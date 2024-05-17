import { useEffect } from 'react'
import {
	useAdventureStateContext,
	useCardStateContext,
	useDeleteAdventure,
	useSaveAdventure
} from '@amaclean2/sundaypeak-treewells'

import { Button, DisplayCard, FooterButtons } from 'Components/Reusable'
import AddPath from 'Components/Reusable/AddPath'

import DeletePage from '../DeletePage'
import SkiFields from './Fields'
import { useNavigate } from 'react-router-dom'

const SkiForm = ({ menuContents }) => {
	const { currentAdventure, isDeletePageOpen, isPathEditOn } = useAdventureStateContext()
	const { enableAddPath } = useCardStateContext()
	const { togglePathEdit, savePath } = useSaveAdventure()
	const { toggleDeletePage } = useDeleteAdventure()
	const navigate = useNavigate()

	useEffect(() => {
		if (
			currentAdventure.adventure_name === 'New Adventure' &&
			!currentAdventure.path?.length &&
			!isPathEditOn
		)
			togglePathEdit()
	}, [])

	return (
		<DisplayCard
			title={currentAdventure.adventure_name || 'New Adventure'}
			onClose={() => (isPathEditOn ? togglePathEdit(false) : navigate(-1))}
		>
			{isPathEditOn ? <AddPath /> : <SkiFields menuContents={menuContents} />}
			<FooterButtons row>
				{isPathEditOn && enableAddPath && (
					<Button
						onClick={() => {
							savePath()
							togglePathEdit(false)
						}}
					>
						Save Path
					</Button>
				)}
				{!isPathEditOn ? (
					<Button
						direction={`/adventure/${currentAdventure.adventure_type}/${currentAdventure.id}`}
					>
						Finish
					</Button>
				) : (
					<Button onClick={() => togglePathEdit(false)}>Cancel</Button>
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
