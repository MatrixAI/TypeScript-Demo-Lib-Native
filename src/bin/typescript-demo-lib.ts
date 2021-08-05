#!/usr/bin/env node

import process from 'process';
import Library from '../lib/Library';
import NumPair from '../lib/NumPair';
import { v4 as uuidv4 } from 'uuid';
import testWorkers from '../lib/workers/test-workers';
import testLevel from '../lib/test-level';
import testUptNative from '../lib/test-utp-native';

async function main(argv = process.argv): Promise<number> {
  // Print out command-line arguments
  argv = argv.slice(2); // Removing prepended file paths.
  process.stdout.write('[' + argv.slice(0, 2).toString() + ']\n');

  // Create a new Library with the value someParam = 'new library'
  // And print it out
  const l = new Library('new library');
  process.stdout.write(l.someParam + '\n');

  // Generate and print a uuid (universally unique identifier)
  process.stdout.write(uuidv4() + '\n');

  // Add the first two command-line args and print the result
  const nums = new NumPair(parseInt(argv[0]), parseInt(argv[1]));
  const sum = nums.num1 + nums.num2;
  process.stdout.write(nums.num1 + ' + ' + nums.num2 + ' = ' + sum + '\n');

  // Testing native modules.
  const dir = argv[2] ?? '.';
  await testLevel(dir);
  await testWorkers();
  await testUptNative();

  process.exitCode = 0;
  return process.exitCode;
}

if (require.main === module) {
  main();
}

export default main;
