#!/usr/bin/env node

import process from 'process';
import Library from '../lib/Library';
import NumPair from '../lib/NumPair';
import { v4 as uuidv4 } from 'uuid';

function main(argv = process.argv): number {
  // Print out command-line arguments
  const argArray = argv.slice(2);
  const args = argArray.toString();
  process.stdout.write('[' + args + ']\n');

  // Create a new Library with the value someParam = 'new library'
  // And print it out
  const l = new Library('new library');
  process.stdout.write(l.someParam + '\n');

  // Generate and print a uuid (universally unique identifier)
  process.stdout.write(uuidv4() + '\n');

  // Add the first two command-line args and print the result
  const nums = new NumPair(parseInt(argv[2]), parseInt(argv[3]));
  const sum = nums.num1 + nums.num2;
  process.stdout.write(nums.num1 + ' + ' + nums.num2 + ' = ' + sum + '\n');

  process.exitCode = 0;
  return process.exitCode;
}

if (require.main === module) {
  main();
}

export default main;
