import { useState, useEffect } from "react"

export default function useCallAirtableAPI(initialValue) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const [projects, setProjects] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			try {
				const url = process.env.REACT_APP_AIRTABLE_URL + '?sort%5B0%5D%5Bfield%5D=id&sort%5B0%5D%5Bdirection%5D=desc'
				const headers = {
					"Content-type": "application/json",
					'Accept': 'application/json',
					"Authorization": `Bearer ${process.env.REACT_APP_AIRTABLE_TOKEN}`
				}
				const response = await fetch(url, {
					headers: headers,
				})
		
				const jsonResponse = await response.json()
				const fetchedProjects = jsonResponse.records.map(response => response.fields)
				setLoading(false)
				setProjects(fetchedProjects)
			} catch (error) {
				setLoading(false)
				setError(error)
			}
		}
		fetchData()
	}, [])


	return {
		loading,
		error,
		projects
	}
}