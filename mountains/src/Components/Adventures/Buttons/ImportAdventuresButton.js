import { useEffect, useState } from 'react'
import { useGetAdventures } from '@amaclean2/sundaypeak-treewells'

const allowedExtensions = ['csv']

export const ImportAdventuresButton = () => {
	const { processCsvAdventures, insertBulkAdventures } = useGetAdventures()
	const [jsonAdventures, setJsonAdventures] = useState(null)

	const handleFileChange = (event) => {
		if (event.target.files.length) {
			const inputFile = event.target.files[0]
			const fileExtension = inputFile?.type.split('/')[1]

			if (!allowedExtensions.includes(fileExtension)) {
				throw new Error('this is not a correct file type')
			}

			const reader = new FileReader()

			reader.onload = async ({ target }) => {
				const newData = await processCsvAdventures({ csvString: target.result })
				setJsonAdventures(newData)

				if (newData.length > 5) {
					throw new Error('only 5 adventures can be created at once')
				}
			}

			reader.readAsText(inputFile)
		}
	}

	useEffect(() => {
		jsonAdventures && insertBulkAdventures({ adventuresObject: jsonAdventures })
	}, [jsonAdventures])

	return (
		<label className='button flex-box import-adventures-button'>
			Import Adventures from .csv
			<input
				type='file'
				name='image'
				onChange={handleFileChange}
			/>
		</label>
	)
}
