import LogoInline from '../Images/Logos/LogoInline'
import getContent from '../TextContent'
import { Button } from 'Components/Reusable'

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
							<Button
								type={'link'}
								direction='/about'
							>
								{getContent('aboutPage.footerAbout')}
							</Button>
						</li>
						<li>
							<Button
								type={'link'}
								direction='/privacy'
							>
								{getContent('aboutPage.footerPrivacy')}
							</Button>
						</li>
						<li>
							<Button
								type={'link'}
								direction='/discover'
							>
								{getContent('aboutPage.footerUseApp')}
							</Button>
						</li>
					</ul>
				</div>
				<div className='footer-column'>
					<h3>{getContent('aboutPage.footerFollow')}</h3>
					<ul>
						<li>
							<Button
								type='link'
								direction='https://instagram.com'
							>
								{getContent('aboutPage.footerIG')}
							</Button>
						</li>
					</ul>
				</div>
			</div>
		</footer>
	)
}

export default AboutFooter
