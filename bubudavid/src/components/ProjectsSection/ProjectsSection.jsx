import { useContext } from 'react'
import { MyContext } from '../Context'
import ProjectCard from './ProjectCard'
import FadeInSection from '../FadeInSection/FadeInSection'
import './ProjectsSection.css'

export default function ProjectsSection() {
	const {
		projects
	} = useContext(MyContext)


	return (
		<FadeInSection>
			<h1 className='Header'>- LINKS -</h1>
			{projects.map((project, key) => (
				<ProjectCard
					key={key}
					project={ project }
				/>
			))}
		</FadeInSection>
	)
}
