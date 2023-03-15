import React from 'react'
import { ButtonPropTypes } from './Types'

export const Button = ({ children, onClick }: ButtonPropTypes) => {
  return <button onClick={onClick}>{children}</button>
}
