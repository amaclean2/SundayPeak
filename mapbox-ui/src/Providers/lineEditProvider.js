import { createContext, useContext, useState } from "react";
import { Lines } from "../SampleData/Lines";

const LineEditContext = createContext();

export const useLineEditContext = () => {
	const context = useContext(LineEditContext);

	if (context === undefined) {
		throw new Error('useLineEditContext must be used within a LineEditProvider');
	}

	return context;
};

export const LineEditProvider = ({ children }) => {
	const [allLines, setAllLines] = useState(Lines);
	const [lineAddState, setLineAddState] = useState(false);
	const [currentLine, setCurrentLine] = useState(null);
	const [isEditable, setIsEditable] = useState(false);

	return (
		<LineEditContext.Provider
			value={{
				lineAddState,
				currentLine,
				isEditable,
				allLines,
				setLineAddState,
				setCurrentLine,
				setIsEditable,
				setAllLines
			}}
		>
			{children}
		</LineEditContext.Provider>
	)
};