import { useAppStateContext } from './Providers/appStateProvider'

export const useInitialCall = () => {
	const { appDispatch } = useAppStateContext()

	const initialCall = () => {
		return fetch('http://localhost:5000/services/initial', {
			method: 'GET'
		})
			.then((response) => response.json())
			.then(({ data }) => {
				console.log(data)
				appDispatch({
					type: 'setMapboxData',
					payload: {
						mapboxToken: data.mapbox_token,
						mapboxStyle: data.map_style
					}
				})
			})
			.catch((error) => console.error(error))
	}

	return initialCall
}
