import React, { createContext, useContext, useEffect, useState } from 'react'

const AdventureEditContext = createContext()

export const useAdventureEditContext = () => {
	const context = useContext(AdventureEditContext)

	if (context === undefined) {
		throw new Error('useAdventureEditContext must be used within a AdventureEditProvider')
	}

	return context
}

export const AdventureEditProvider = ({ children }) => {
	const initialStartPosition = JSON.parse(localStorage.getItem('startPos')) || {
		latitude: 39.347,
		longitude: -120.194,
		zoom: 10
	}

	const [allAdventures, setAllAdventures] = useState([]) // an array
	const [adventureAddState, setAdventureAddState] = useState(false) // a boolean
	const [currentAdventure, setCurrentAdventure] = useState(null) // an object
	const [editAdventureFields, setEditAdventureFields] = useState({}) // an object
	const [currentBoundingBox, setCurrentBoundingBox] = useState(null) // an object
	const [isEditable, setIsEditable] = useState(false) // a boolean
	const [adventureError, setAdventureError] = useState(null) // a string
	const [mapboxToken, setMapboxToken] = useState(null) // a string
	const [startPosition, setStartPosition] = useState(initialStartPosition) // an object
	const [flying, setFlying] = useState(false) // an object
	const [isDeletePage, setIsDeletePage] = useState(false) // a boolean
	const [saveState, setSaveState] = useState(0) // an integer
	const [mapStyle, setMapStyle] = useState('') // a string

	useEffect(() => {
		localStorage.setItem('startPos', JSON.stringify(startPosition))
	}, [startPosition])

	return (
		<AdventureEditContext.Provider
			value={{
				adventureAddState,
				currentAdventure,
				isEditable,
				allAdventures,
				adventureError,
				mapboxToken,
				startPosition,
				flying,
				editAdventureFields,
				currentBoundingBox,
				isDeletePage,
				saveState,
				mapStyle,
				setAdventureAddState,
				setCurrentAdventure,
				setIsEditable,
				setAllAdventures,
				setAdventureError,
				setMapboxToken,
				setStartPosition,
				setFlying,
				setEditAdventureFields,
				setCurrentBoundingBox,
				setIsDeletePage,
				setSaveState,
				setMapStyle
			}}
		>
			{children}
		</AdventureEditContext.Provider>
	)
}
