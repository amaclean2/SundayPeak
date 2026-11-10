export const mockJsonPromise = jest.fn(async () => {
	return {
		data: {}
	}
})

export const mockFetch = jest.fn(async (): Promise<any> => {
	return {
		json: mockJsonPromise
	}
})

global.fetch = mockFetch
