import { VscGithubInverted, VscGithub } from "react-icons/vsc"
import { AiOutlineLinkedin, AiFillLinkedin } from "react-icons/ai"

const data = {
	"name": "David",
	"alias": "Bubu 🦕",
	"mainPhoto": "/assets/pp.jpg",
	"age": 22,
	"social_links": [
		{ 
			"name": "GitHub",
			"iconOut": <VscGithub />,
			"iconFill": <VscGithubInverted />,
			"link": "https://github.com/BubuDavid"
		 },
		{
			"name": "LinkedIn",
			"iconOut": <AiOutlineLinkedin />,
			"iconFill": <AiFillLinkedin />,
			"link": "https://www.linkedin.com/in/davidpedrozasegoviano/"
		},
	]
}

export default data