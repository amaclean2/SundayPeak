import React from 'react'
import { useAdventureStateContext } from 'State'

import { Field, FieldRow } from 'Components/Reusable'

import './styles.css'

const AdventureTitle = ({ title }) => {
	const { currentAdventure } = useAdventureStateContext()
	const displayTitle = title ?? currentAdventure?.adventure_name

	if (!displayTitle) return null

	return (
		<FieldRow className={'adventure-title-row'}>
			<Field noPadding>
				<h1 className={'adventure-title'}>{displayTitle}</h1>
			</Field>
		</FieldRow>
	)
}

export default AdventureTitle
