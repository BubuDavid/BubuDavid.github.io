import AlsoIndex from './components/AlsoIndex/AlsoIndex';
import Archive from './components/Archive/Archive';
import SelectedWork from './components/CaseStudy/SelectedWork';
import Colophon from './components/Colophon/Colophon';
import Contact from './components/Contact/Contact';
import Cover from './components/Cover/Cover';
import Masthead from './components/Masthead/Masthead';
import NetworkMap from './components/NetworkMap/NetworkMap';
import Timetable from './components/Timetable/Timetable';
import TopNav from './components/TopNav/TopNav';
import { useInitialHash, useJumpLinks } from './lib/jump';

export default function App() {
  useJumpLinks();
  useInitialHash();
  return (
    <>
      <TopNav />
      <Masthead />
      <main>
        <Cover />
        <NetworkMap />
        <SelectedWork />
        <AlsoIndex />
        <Archive />
        <Timetable />
        <Contact />
      </main>
      <Colophon />
    </>
  );
}
