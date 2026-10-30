import { useInitialHash, useJumpLinks } from './lib/jump';

export default function App() {
  useJumpLinks();
  useInitialHash();
  return <main />;
}
