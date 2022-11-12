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

	const [allAdventures, setAllAdventures] = useState([])
	const [adventureAddState, setAdventureAddState] = useState(false)
	const [currentAdventure, setCurrentAdventure] = useState(null)
	const [editAdventureFields, setEditAdventureFields] = useState({})
	const [currentBoundingBox, setCurrentBoundingBox] = useState(null)
	const [isEditable, setIsEditable] = useState(false)
	const [adventureError, setAdventureError] = useState(null)
	const [mapboxToken, setMapboxToken] = useState(null)
	const [startPosition, setStartPosition] = useState(initialStartPosition)
	const [flying, setFlying] = useState(false)
	const [isDeletePage, setIsDeletePage] = useState(false)
	const [saveState, setSaveState] = useState(0)
	const [mapStyle, setMapStyle] = useState('')

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
