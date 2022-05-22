import { createContext } from "react"
import data from "../../data/data"
import useCallAirtableAPI from "../../customHooks/airtable"


const MyContext = createContext()

function MyProvider({ children }) {
	const { 
		projects
	} = useCallAirtableAPI(0)
	const getIconsPosition = (links) => {
		const photo = document.querySelector('.MainPhoto')
		const icons = document.querySelectorAll('.Icon')
		const photoWidth = photo.clientWidth
		const iconWidth = icons[0].clientWidth
		const nLinks = links.length
		const angleSeparation = 360.0 / nLinks
		const radius = (photoWidth / 2 + iconWidth / 2) * (1.05)
		let angles = []
		let currentAngle = 270
		for (let i = 0; i < nLinks; i++) {
			angles.push(currentAngle)
			currentAngle += angleSeparation
		}
		let positions = []
		for (let i = 0; i < nLinks; i++) {
			// Coordinates transformations
			let x = radius * Math.cos(angles[i] * Math.PI / 180)
			let y = radius * Math.sin(angles[i] * Math.PI / 180)
			positions.push([Math.floor(x), Math.floor(y)])
		}

		setTimeout(() => {
			appear(icons, positions)
		}, 1000);

	}

	function appear(icons, positions) {
		icons.forEach((icon, index) => {
			icon.classList.add("active")
			icon.style.transform = `translate(${positions[index][0]}px,${positions[index][1]}px)`
		});
	}

	return (
		<MyContext.Provider value={{
			data,
			getIconsPosition,
			projects
		}}>
			{ children }
		</MyContext.Provider>
	)
}

export {MyContext, MyProvider}