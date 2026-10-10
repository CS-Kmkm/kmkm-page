// @vitest-environment node
import { createRequire } from 'node:module';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
// Resolve through the declared config, not an extraneous top-level installation.
const configRequire = createRequire(require.resolve('eslint-config-next'));
const pluginEntry = configRequire.resolve('@next/eslint-plugin-next');
const pluginRequire = createRequire(pluginEntry);
const pluginDirectory = path.dirname(pluginEntry);
const { getRootDirs } = pluginRequire(path.join(pluginDirectory, 'utils/get-root-dirs.js')) as {
  getRootDirs: (context: { cwd: string; settings: { next?: { rootDir?: unknown } } }) => string[];
};

describe('Next ESLint root discovery with the scoped glob dependency replacement', () => {
  it('exercises the pinned plugin and its actual substituted dependency', () => {
    expect(pluginRequire('@next/eslint-plugin-next/package.json').version).toBe('16.3.8');
    expect(pluginRequire('fast-glob/package.json')).toMatchObject({ name: 'tinyglobby', version: '0.2.17' });
  });

  it('defaults to the ESLint working directory', () => {
    expect(getRootDirs({ cwd: process.cwd(), settings: {} })).toEqual([process.cwd()]);
  });

  it.each([
    ['src/app', ['src/app']],
    ['src\\app', ['src/app']],
    ['src/{app,lib}', ['src/app', 'src/lib']],
    [['src/app', 'src/lib', 42], ['src/app', 'src/lib']],
    ['.github', ['.github']],
    ['missing-root-*', []],
    [path.resolve('src/app'), [path.resolve('src/app').replaceAll('\\', '/')]],
    [path.parse(process.cwd()).root, [path.parse(process.cwd()).root.replaceAll('\\', '/')]],
  ])('discovers only matching root directories for %j', (rootDir, expected) => {
    expect(getRootDirs({ cwd: process.cwd(), settings: { next: { rootDir } } }).sort()).toEqual(expected);
  });

  it.each(['src/app/**', `${path.resolve('src/app').replaceAll('\\', '/')}/**`])(
    'discovers descendants without the crawl base for %s', (rootDir) => {
      const expected = readdirSync('src/app', { recursive: true, withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => {
          const directory = path.resolve(entry.parentPath, entry.name);
          return (path.isAbsolute(rootDir) ? directory : path.relative(process.cwd(), directory)).replaceAll('\\', '/');
        }).sort();
      expect(getRootDirs({ cwd: process.cwd(), settings: { next: { rootDir } } }).sort()).toEqual(expected);
    },
  );
});
