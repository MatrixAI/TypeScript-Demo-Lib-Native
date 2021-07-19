//testing worker threads.
import { Pool, spawn, Worker } from 'threads';
import process from 'process';
import * as os from 'os';

async function testWorkers() {
  process.stdout.write('Lets test workers.\n');
  const coreCount = os.cpus().length;
  const pool = Pool(() => spawn(new Worker('./worker')), coreCount);
  for (let i = 0; i < coreCount; i++) {
    pool.queue(async (hellower) => {
      process.stdout.write((await hellower.helloWorld()) + '\n');
    });
  }
  await pool.completed();
  process.stdout.write('\n');
  await pool.terminate();
}

export default testWorkers;
