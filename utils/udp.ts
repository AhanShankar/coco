import dgram from 'react-native-udp';
const UDP_PORT = 4133;
// create remote info type
type RemoteInfo = {
    address: string;
    port: number;
    family: 'IPv4' | 'IPv6';
    size: number;
};

export default function createUDPServer(onMessage: (msg: Buffer, rinfo: RemoteInfo) => void) {
    const server = dgram.createSocket({ type: 'udp4' });
    server.on('error', (err) => {
        console.error(`UDP Server error: ${err}`);
    });
    server.on('message', (msg: Buffer, rinfo: RemoteInfo) => {
        console.log(`UDP Server received message: ${msg} from ${rinfo.address}:${rinfo.port}`);
        onMessage(msg, rinfo);
    });
    server.bind(UDP_PORT);
    return server
}