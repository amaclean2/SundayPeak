import React from 'react'
import Page from '../Reusable/Page'
import MainLogo from '../Assets/Logos/SundayLogos/SundayLogo.png'
import './styles.css';
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <Page className={'first-page'}>
      <img src={MainLogo} className='main-logo' />
      <h2 className='hero-text'>Find an adventure.<br />Find a friend.<br />Play outside.<br />Repeat.</h2>
      <Link to="https://sundaypeak.com" className={'button hero-button'}>Sign Up</Link>
    </Page>
  )
}

export default HomePage