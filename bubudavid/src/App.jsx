import Cover from './components/Cover/Cover';
import Masthead from './components/Masthead/Masthead';
import NetworkMap from './components/NetworkMap/NetworkMap';
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
      </main>
    </>
  );
}
