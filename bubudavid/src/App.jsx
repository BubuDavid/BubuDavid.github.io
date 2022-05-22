import Header from './components/Header/Header'
import Main from './components/Main/Main'
import ProjectsSection from './components/ProjectsSection/ProjectsSection'
import Footer from './components/Footer/Footer'
import { MyProvider } from './components/Context'
import SocialBar  from './components/SocialBar/SocialBar'

function App() {
  return (
		<MyProvider>
			<Header />
			<Main />
			<SocialBar />
			<ProjectsSection />
			<Footer />
    </MyProvider>
  )
}

export default App
