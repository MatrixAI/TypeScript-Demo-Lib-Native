import utp from 'utp-native';
import { sleep } from '../utils';

async function testUptNative() {
  // upt-native tests
  process.stdout.write('Lets test utp-native.\n');
  const server = utp.createServer((socket) => {
    socket.pipe(socket);
  });

  server.listen(() => {
    const socket = utp.connect(server.address().port);

    socket.write('hello UTP!!\n');
    socket.end();

    socket.on('data', (data) => {
      process.stdout.write('echo: ' + data + '\n');
    });
    socket.on('end', () => {
      process.stdout.write('ended\n');
      server.close();
    });
  });
  await sleep(2000);
}

export default testUptNative;
