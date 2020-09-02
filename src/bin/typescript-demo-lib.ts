#!/usr/bin/env node

import process from 'process';
import Library from '../lib/Library';

function main() {
  console.log(process.argv.slice(2));
  const l = new Library('new library');
  console.log(l.someParam);
}

main();
