import Tag from './Tag'
export default function ProjectCard({ project }) {
	return (
		<div className='ProjectCardContainer'>
			<div
				className="ProjectCard"
				onClick={() => window.open(project.link)}
			>
				<img
					className="ProjectCardImg"
					src={project.image ? project.image[0].url : process.env.PUBLIC_URL + "default.png"}
					/>
				<div
					className="CardInfo"
				>
					<h3 className="CardName">{project.name}</h3>
					<p className="CardDescription">{project.description}</p>
					<div className='TagContainer'>
						{project.tags.map((tag, key) => (
							<Tag tag={tag} key={key}/>
							))}
					</div>
				</div>
			</div>
		</div>
	)
}
