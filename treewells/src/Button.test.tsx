import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Button } from './Button'

test('button renders', () => {
  render(<Button onClick={() => {}}>Hi</Button>)
  expect(screen.getByRole('button', { name: 'Hi' })).toBeDefined()
})
