import { useState, useEffect, useRef } from "react"

export default function FadeInSection(props) {
  const [isVisible, setVisible] = useState(false)
  const domRef = useRef()
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setVisible(entry.isIntersecting))
    })
    observer.observe(domRef.current)
  }, [])
  return (
    <div
      className={`fade-in-section ${isVisible ? 'isVisible' : ''} ProjectsSection`}
      ref={domRef}
    >
      {props.children}
    </div>
  )
}