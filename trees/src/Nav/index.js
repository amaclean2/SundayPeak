import React from 'react'
import cx from 'classnames'

import './styles.css'
import CloseIcon from '../Assets/UIGlyphs/Close'
import { Link } from 'react-router-dom'

const Nav = ({navOpen, setNavOpen}) => {
  return (
    <div className={cx('navigation-container', navOpen && 'nav-open')}>
      <div className="nav-header">
        <button className={'button'} onClick={() => setNavOpen(false)}>
          <CloseIcon />
        </button>
      </div>
      <div className="nav-content">
        <ul>
          <li><Link to={'/'} onClick={() => setNavOpen(false)}>Home</Link></li>
          <li><Link to={'/privacy'} onClick={() => setNavOpen(false)}>Privacy Policy</Link></li>
          <li><Link to={'/support'} onClick={() => setNavOpen(false)}>Support</Link></li>
        </ul>
      </div>
    </div>
  )
}

export default Nav