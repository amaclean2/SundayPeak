import { MouseEventHandler, ReactNode } from 'react'

export type ButtonPropTypes = {
  children: ReactNode
  onClick: MouseEventHandler<HTMLButtonElement>
}
