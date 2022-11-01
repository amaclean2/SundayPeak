import { Link } from 'react-router-dom'
import LogoInline from '../Images/LogoInline'

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
					<h3>Map</h3>
					<ul>
						<li>
							<Link to='/about'>About</Link>
						</li>
						<li>
							<Link to='/discover'>Use Sunday Peak</Link>
						</li>
					</ul>
				</div>
				<div className='footer-column'>
					<h3>Follow</h3>
					<ul>
						<li>
							<Link to='https://instagram.com'>Instagram</Link>
						</li>
					</ul>
				</div>
			</div>
		</footer>
	)
}

export default AboutFooter
