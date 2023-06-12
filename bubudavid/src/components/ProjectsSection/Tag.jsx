export default function Tag({ tag }) {
	function getColor(name) {
		if (name === "Python") return "#F7C73A"
		if (name === "JavaScript") return "#EAD41C"
		if (name === "HTML") return "#F4470B"
		if (name === "HTML") return "#F4470B"
		if (name === "CSS") return "#2895D0"
		if (name === "ReactJS") return "#5CCFEE"
		if (name === "Flask") return "#6A67CE"
		if (name === "FastAPI") return "#059184"


		return "#FF4949"
	}

	function mouseOver(e) {
		const style = e.target.style;
		const color = getColor(e.target.innerText)
		style.border = `3px solid ${color}`
		style.boxShadow = `0 0 9px ${color}`
	}

	function mouseOut(e) {
		const style = e.target.style;
		style.border = "3px solid #57E089"
		style.boxShadow = "0 0 8px #57E089"
	}

	return (
		<span
			className='Tag'
			onMouseOver={mouseOver}
			onMouseOut={mouseOut}
		>
			{ tag }
		</span>
	)
}
