import { create } from 'kubo-rpc-client';
import fs from 'fs/promises'

// IPFS ノードに接続
const ipfs = create({ url: 'http://localhost:5001' });

async function main() {
  try {
    // ファイルの追加
    const jsonData = await fs.readFile('tourist_spots.json', 'utf8');
    const jsonObject = JSON.parse(jsonData);
    const jsonString = JSON.stringify(jsonObject);

    const file = await ipfs.add(jsonString);
    console.log("ファイルパス: ", file.path);

    // cidの取得
    const cid = file.cid.toString();
    console.log(cid);

    // ファイルの取得
    const stream = await ipfs.cat(cid);
    let data = '';
    for await (const chunk of stream) {
      data += new TextDecoder().decode(chunk);
    }
    console.log('Retrieved data:', JSON.parse(data));

    // ピアリスト取得
    const peers = await ipfs.swarm.peers();
    console.log('Connected peers:', peers.length);

    // IPFSノードの情報を取得
    const nodeInfo = await ipfs.id();
    console.log('IPFS Node ID:', nodeInfo.id);

  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);