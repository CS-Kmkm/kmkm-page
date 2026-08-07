import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const appBuildRoot = path.join(projectRoot, '.next', 'server', 'app');
const nextRoot = path.join(projectRoot, '.next');

async function findManifests(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const manifests = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      manifests.push(...await findManifests(entryPath));
    } else if (entry.name === 'page_client-reference-manifest.js') {
      manifests.push(entryPath);
    }
  }

  return manifests;
}

function parseManifest(source, filePath) {
  const assignmentIndex = source.lastIndexOf(' = {');
  const terminatorIndex = source.lastIndexOf(';');
  if (assignmentIndex === -1 || terminatorIndex === -1) {
    throw new Error(`Unexpected client manifest format: ${filePath}`);
  }

  return JSON.parse(source.slice(assignmentIndex + 3, terminatorIndex));
}

function routeFromManifest(filePath) {
  const relativeDirectory = path.relative(appBuildRoot, path.dirname(filePath));
  return relativeDirectory === '' ? '/' : `/${relativeDirectory.split(path.sep).join('/')}`;
}

const measurements = [];

for (const manifestPath of await findManifests(appBuildRoot)) {
  const manifest = parseManifest(await readFile(manifestPath, 'utf8'), manifestPath);
  const chunks = new Set(Object.values(manifest.entryJSFiles ?? {}).flat());
  let bytes = 0;

  for (const chunk of chunks) {
    bytes += (await stat(path.join(nextRoot, chunk))).size;
  }

  measurements.push({
    route: routeFromManifest(manifestPath),
    chunks: chunks.size,
    bytes,
    kib: Number((bytes / 1024).toFixed(1)),
  });
}

measurements.sort((left, right) => left.route.localeCompare(right.route));
console.table(measurements);
