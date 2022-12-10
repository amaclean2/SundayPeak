import { Link } from 'react-router-dom'
import LogoInline from '../Images/LogoInline'
import getContent from '../TextContent'

const AboutFooter = () => {
	return (
		<footer className='about-footer'>
			<div className='footer-columns flex-box'>
				<div className='footer-column'>
					<LogoInline
						width={200}
						color={'white'}
					/>
				</div>
				<div className='footer-column'>
					<h3>{getContent('aboutPage.footerMap')}</h3>
					<ul>
						<li>
							<Link to='/about'>{getContent('aboutPage.footerAbout')}</Link>
						</li>
						<li>
							<Link to='/discover'>{getContent('aboutPage.footerUseApp')}</Link>
						</li>
					</ul>
				</div>
				<div className='footer-column'>
					<h3>{getContent('aboutPage.footerFollow')}</h3>
					<ul>
						<li>
							<Link to='https://instagram.com'>{getContent('aboutPage.footerIG')}</Link>
						</li>
					</ul>
				</div>
			</div>
		</footer>
	)
}

export default AboutFooter
