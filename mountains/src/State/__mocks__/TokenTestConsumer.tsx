import React from 'react'
import { useTokenStateContext } from '../Providers/TokenStateProvider'

const TokenTestConsumer = (): JSX.Element => {
	const { mapboxToken, mapboxStyleKey, tokenError, tokenDispatch } = useTokenStateContext()

	const setInitialTokens = (): void => {
		tokenDispatch({
			type: 'setTokens',
			payload: {
				mapboxToken: '123',
				mapboxStyleKey: '456',
				githubIssueToken: '123'
			}
		})
	}

	const setTokenError = (): void => {
		tokenDispatch({
			type: 'setTokenError',
			payload: 'New Token Error'
		})
	}

	return (
		<div>
			<span>Mapbox token: {mapboxToken}</span>
			<span>Mapbox style key: {mapboxStyleKey}</span>
			<span>Token error view: {tokenError}</span>

			<button onClick={setInitialTokens}>Set Initial Tokens</button>
			<button onClick={setTokenError}>Set Token Error</button>
		</div>
	)
}

export default TokenTestConsumer
