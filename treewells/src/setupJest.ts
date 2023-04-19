export const mockJsonPromise = jest.fn(async () => {
	return {
		data: {}
	}
})

export const mockFetch = jest.fn(async (args): Promise<any> => {
	console.log({ args })
	return {
		json: mockJsonPromise
	}
})

global.fetch = mockFetch
