import fs from 'fs';
import path from 'path';
import lock from 'fd-lock';

async function testFdLock(dir: string) {
  const fh = await fs.promises.open(
    path.join(dir, 'lockfile'),
    fs.constants.O_CREAT | fs.constants.O_RDWR,
  );
  lock(fh.fd);
  process.stdout.write('Acquired lock!\n');
  lock.unlock(fh.fd);
  await fh.close();
}

export { testFdLock };
