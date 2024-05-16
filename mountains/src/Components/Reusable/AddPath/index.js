import { useAdventureStateContext, useSaveAdventure } from '@amaclean2/sundaypeak-treewells'
import { ParentSize } from '@visx/responsive'

import { Field, FieldHeader, FieldPage, FieldRow, FieldValue, FormField } from 'Components/Reusable'
import { LargeActivityIcon } from 'Images'
import ElevationChart from '../Chart'

const AddPath = () => {
	const { workingPath, matchPath } = useAdventureStateContext()
	const { toggleMatchPath } = useSaveAdventure()

	return (
		<FieldPage>
			<FieldRow>
				<Field minField>
					<LargeActivityIcon size={50} />
				</Field>
				<Field longText>
					Click on the path button to add a path, then double click on the map to finish.
				</Field>
			</FieldRow>

			<FieldRow>
				{workingPath?.elevations?.length ? (
					<ParentSize>
						{({ width }) => (
							<ElevationChart
								width={width}
								height={200}
								data={workingPath.elevations}
							/>
						)}
					</ParentSize>
				) : null}
			</FieldRow>

			<FieldRow>
				<Field>
					<FieldHeader>Path Max Elevation</FieldHeader>
					<FieldValue className={'stat-field'}>
						{[Infinity, -Infinity, undefined].includes(workingPath.maxEl) ? 0 : workingPath.maxEl}{' '}
						ft
					</FieldValue>
				</Field>
				<Field>
					<FieldHeader>Path Min Elevation</FieldHeader>
					<FieldValue className={'stat-field'}>
						{[Infinity, -Infinity, undefined].includes(workingPath.minEl) ? 0 : workingPath.minEl}{' '}
						ft
					</FieldValue>
				</Field>
			</FieldRow>

			<FieldRow>
				<Field>
					<FieldHeader>Distance</FieldHeader>
					<FieldValue className={'stat-field'}>
						{(workingPath.elevations[workingPath.elevations.length - 1]?.[1] ?? 0).toFixed(2)} mi
					</FieldValue>
				</Field>
			</FieldRow>

			<FieldRow>
				<FormField
					name='pathMatch'
					label={'Match path to a given road or trail'}
					type={'checkbox'}
					isEditable
					fullWidth
					className='no-padding'
					value={matchPath}
					onChange={() => toggleMatchPath()}
				/>
			</FieldRow>
		</FieldPage>
	)
}

export default AddPath
