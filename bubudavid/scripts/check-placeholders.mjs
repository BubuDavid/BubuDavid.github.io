// Stops `npm run deploy` while invented or unreviewed content is still in the repo.
// A file is flagged when one of its lines starts with `// RELLENO` or `// REVISAR`.
import { readdirSync, readFileSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MARKER = /^\/\/ (RELLENO|REVISAR)\b/gm;
const FOLDERS = ['src/content', 'src/components/figures'];

export function findPlaceholders(files) {
  return files.flatMap(({ path: file, text }) => {
    const markers = new Set([...text.matchAll(MARKER)].map(match => match[1]));
    return [...markers].map(marker => ({ path: file, marker }));
  });
}

function readSources(root) {
  return FOLDERS.flatMap(folder => {
    let names;
    try {
      names = readdirSync(path.join(root, folder)).sort();
    } catch (error) {
      if (error.code === 'ENOENT') return []; // the figures folder may not exist yet
      throw error;
    }
    return names
      .filter(name => /\.jsx?$/.test(name))
      .map(name => ({
        path: `${folder}/${name}`,
        text: readFileSync(path.join(root, folder, name), 'utf8'),
      }));
  });
}

function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const found = findPlaceholders(readSources(root));
  if (found.length === 0) return;
  for (const { path: file, marker } of found) console.log(`${file}: ${marker}`);
  console.log('Replace or review these files, then delete the marker line, before deploying.');
  process.exitCode = 1;
}

// Run directly, not imported by the tests. Node resolves symlinks in import.meta.url, so argv[1] must be resolved too.
if (process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) main();
