import React from 'react'
import './styles.css'
import cx from 'classnames'

const Page = ({children, className}) => {
  return (
    <div className={cx('page', className)}>{children}</div>
  )
}

export default Page