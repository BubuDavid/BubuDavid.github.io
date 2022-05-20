import Header from './components/Header/Header'
import Main from './components/Main/Main'
import ProjectsSection from './components/ProjectsSection/ProjectsSection'
import Footer from './components/Footer/Footer'
import { MyProvider } from './components/Context'

function App() {
  return (
    <MyProvider>
			<Header />
			<Main />
			<ProjectsSection />
			<Footer />
    </MyProvider>
  )
}

export default App
