import React from 'react'
import './styles.css'
import IconLogo from '../Assets/Logos/SP_Favicon.png'
import Hamburger from '..//Assets/UIGlyphs/Hamburger'

const Header = ({setNavOpen}) => {
  return (
    <div className='header'>
      <button onClick={() => setNavOpen(true)} className='button header-button'>
      <Hamburger />
      </button>
      <img src={IconLogo} className='sp-logo' />
    </div>
  )
}

export default Header