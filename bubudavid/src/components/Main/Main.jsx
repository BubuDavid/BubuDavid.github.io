import { useContext } from 'react'
import { MyContext } from '../Context'
import './Main.css'

export default function Main() {
	const {
		data,
		projects,
		getIconsPosition
	} = useContext(MyContext)
	return (
		<div className='Main'>
			<div className='Logo'>
				<div className='Carousell' onLoad={() => {
						getIconsPosition(projects)
				}}>
					{projects.map((project, key) => {
						return <a
							className='Icon'
							href={project.link}
							target="_blank"
							rel='noreferrer'
							key={key}
						>
							<img
								className='IconImg'
								src={project.image ? project.image[0].url : process.env.PUBLIC_URL + "default.png"} 
								alt={"Carousell Project"}
							/>
						</a>
					})}
				</div>
				<img className='MainPhoto' src={process.env.PUBLIC_URL + data.mainPhoto} alt="Me!" />
			</div>
		</div>
	)
}
