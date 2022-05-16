import { createContext, useContext, useState } from "react";

const LineEditContext = createContext();

export const useLineEditContext = () => {
	const context = useContext(LineEditContext);

	if (context === undefined) {
		throw new Error('useLineEditContext must be used within a LineEditProvider');
	}

	return context;
};

export const LineEditProvider = ({ children }) => {
	const [lineEditState, setLineEditState] = useState(false);
	const [currentLine, setCurrentLine] = useState(null);

	return (
		<LineEditContext.Provider
			value={{
				lineEditState,
				currentLine,
				setLineEditState,
				setCurrentLine
			}}
		>
			{children}
		</LineEditContext.Provider>
	)
};