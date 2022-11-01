import logoColor from './SundayLogos/SundayLogo.png'
import logoBlack from './SundayLogos/SundayLogo_Black.png'
import logoWhite from './SundayLogos/SundayLogo_White.png'

const LogoInline = ({ width = 500, color = 'black' }) => {
	return (
		<img
			width={width}
			src={
				(color === 'black' && logoBlack) ||
				(color === 'green' && logoColor) ||
				(color === 'white' && logoWhite)
			}
			alt={''}
		/>
	)
}

export default LogoInline
