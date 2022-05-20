import { useContext } from 'react'
import { MyContext } from '../Context'
import './Main.css'

export default function Main() {
	const {
		data,
		projects,
		positions
	} = useContext(MyContext)

	const appear = () => {
		const icons = document.querySelectorAll(".Icon")
		setTimeout(() => {
			icons.forEach((icon, index) => {
				icon.classList.add("active")
				icon.style.transform = `translate(${positions[index][0]}px,${positions[index][1]}px)`
			})
		}, 1000);
	}
	return (
		<div className='Main'>
			<div className='Logo'>
				<div className='Carousell' onLoad={() => appear()}>
					{projects.map((project, key) => {
						return <a
							className='Icon'
							href={project.link}
							target="_blank"
							key={key}
						>
							<img
								className='IconImg'
								src={project.image ? project.image[0].url : process.env.PUBLIC_URL + "default.png"} 
							/>
						</a>
					})}
				</div>
				<img className='MainPhoto' src={process.env.PUBLIC_URL + data.mainPhoto} alt="Me!" />
			</div>
		</div>
	)
}
