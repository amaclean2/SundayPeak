import React from 'react'
import { useTokenStateContext } from '../Providers/TokenStateProvider'

const TokenTestConsumer = (): JSX.Element => {
	const { mapboxToken, mapboxStyleKey, tokenDispatch } = useTokenStateContext()

	const setInitialTokens = (): void => {
		tokenDispatch({
			type: 'setTokens',
			payload: {
				mapboxToken: '123',
				mapboxStyleKey: '456'
			}
		})
	}

	return (
		<div>
			<span>Mapbox token: {mapboxToken}</span>
			<span>Mapbox style key: {mapboxStyleKey}</span>

			<button onClick={setInitialTokens}>Set Initial Tokens</button>
		</div>
	)
}

export default TokenTestConsumer
