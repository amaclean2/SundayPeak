import { type AdventureList } from '../../Types/Adventures'
import { mockFetch } from '../../setupJest'

export const mockGetAdventures = (): void => {
	mockFetch.mockResolvedValueOnce({
		json: async () => ({
			data: {
				adventures: {
					type: 'FeatureCollection',
					features: [
						{
							type: 'Feature',
							geometry: {
								type: 'Point',
								coordinates: [5, 10]
							},
							properties: {
								id: 1,
								adventure_name: 'New Adventure',
								adventure_type: 'ski',
								public: true
							}
						}
					]
				} as AdventureList
			}
		})
	})
}
