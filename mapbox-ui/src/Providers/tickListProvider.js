import { createContext, useContext, useState } from "react";
import { TicksPerUser } from "../SampleData/Ticks";

const TickListContext = createContext();

export const useTickListContext = () => {
	const context = useContext(TickListContext);

	if (context === undefined) {
		throw new Error('useTickListContext must be used within a TickListProvider');
	}

	return context;
};

export const TickListProvider = ({ children }) => {
    const [allTicks, setAllTicks] = useState(TicksPerUser);

	const addToTicklist = (tickId) => {
		setAllTicks((currTickList) => {
			const newTicks = [...currTickList, { tickId }];
			return newTicks;
		});
	};

	return (
		<TickListContext.Provider
			value={{
				allTicks,
                addToTicklist
			}}
		>
			{children}
		</TickListContext.Provider>
	)
};