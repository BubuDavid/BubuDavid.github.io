import { useContext } from 'react'
import { MyContext } from '../Context'
import './Header.css'

export default function Header() {
	const {
		data
	} = useContext(MyContext)

	return (
		<div className='Header'>
			<span>Hi there 👋, my name is</span>
			<h1 className='name'>{data.name} ({data.alias})</h1>
			<span>Welcome to my personal Link Tree 🎄, here are some of my links 👇</span>
		</div>
	)
}
