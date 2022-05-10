import path from 'path';
import nodeGypBuild from 'node-gyp-build';

interface Native {
  addOne(n: number): number;
  timesTwo(n: number): number;
  createArr(): [number];
  createObj(): { key: string };
  setProperty(obj: { key1: string }): { key1: string; key2: string };
}

// Path to project root containing package.json and binding.gyp
const native: Native = nodeGypBuild(path.join(__dirname, '../../'));

export default native;
