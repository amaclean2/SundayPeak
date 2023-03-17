import React, { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Consumer } from '../Testing/TestConsumer'
import { UserStateProvider } from './UserStateProvider'

const customRender = (element: ReactNode, renderOptions?: any) => {
	return render(<UserStateProvider>{element}</UserStateProvider>, renderOptions)
}

test("The login error value shouldn't be defined", async () => {
	render(<Consumer />)
	expect(screen.getByTestId('user-consumer')).toHaveTextContent('My error is: undefined')
})

test('Error value should be defined once set', async () => {
	customRender(<Consumer />)
	setTimeout(() => {
		expect(screen.getByTestId('user-consumer')).toHaveTextContent('My error is: New Error')
	}, 100)
})
