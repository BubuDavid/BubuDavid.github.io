import { createContext } from "react"
import data from "../../data/data"
import useCallAirtableAPI from "../../customHooks/airtable"


const MyContext = createContext()

function MyProvider({ children }) {
	const { 
		projects
	} = useCallAirtableAPI(0)
	const getIconsPosition = (links) => {
		const nLinks = links.length
		const angleSeparation = 360.0 / nLinks
		const radius = 205
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
		return positions
	}
	const positions = getIconsPosition(projects)

	return (
		<MyContext.Provider value={{
			data,
			positions,
			projects
		}}>
			{ children }
		</MyContext.Provider>
	)
}

export {MyContext, MyProvider}