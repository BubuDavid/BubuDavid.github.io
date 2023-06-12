import { useContext } from 'react'
import { MyContext } from '../Context'
import './SocialBar.css'

export default function SocialBar() {
	const {
		data
	} = useContext(MyContext)

	const socialIcons = data.social_links

	return (
		<ul className='SocialBar'>
			{socialIcons.map((icon, key) => (
				<li
					className='SocialIcon'
					key={key}
					onClick={() => {
						window.open(icon.link)
					}}
				>
					{icon.iconOut}
				</li>
			))}
		</ul>
	)
}