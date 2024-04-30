import { useAdventureStateContext, useSaveAdventure } from '@amaclean2/sundaypeak-treewells'
import { Field, FieldHeader, FieldPage, FieldRow, FieldValue, FormField } from 'Components/Reusable'
import { LargeSkierIcon } from 'Images'
import React, { useEffect } from 'react'

const AddPath = () => {
	const { savePath, toggleMatchPath } = useSaveAdventure()
	const { currentAdventure, workingPath, isPathEditOn, matchPath } = useAdventureStateContext()

	useEffect(() => {
		savePath()
	}, [])

	useEffect(() => {
		console.log({ workingPath })
	}, [workingPath])

	return (
		<FieldPage>
			<FieldRow>
				<Field minField>
					<LargeSkierIcon
						size={50}
						className={'editor-skier'}
					/>
				</Field>
				<Field longText>
					Click on the map to start drawing the ski path. Then double click to finish the path.
				</Field>
			</FieldRow>
			<FieldRow>
				<Field>
					<FieldHeader>Path Max Elevation</FieldHeader>
					<FieldValue className={'stat-field'}>{currentAdventure.path ? 10 : 0}</FieldValue>
				</Field>
				<Field>
					<FieldHeader>Path Min Elevation</FieldHeader>
					<FieldValue className={'stat-field'}>{currentAdventure.path ? 10 : 0}</FieldValue>
				</Field>
			</FieldRow>
			<FieldRow>
				{isPathEditOn && (
					<FormField
						name='pathMatch'
						label={'Match path to a given road or trail'}
						type={'checkbox'}
						isEditable
						fullWidth
						className='no-padding'
						value={matchPath}
						onChange={toggleMatchPath}
					/>
				)}
			</FieldRow>
		</FieldPage>
	)
}

export default AddPath
