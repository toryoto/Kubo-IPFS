import { create } from 'kubo-rpc-client';

async function main(cid) {
  const client = create('http://localhost:5001');

  try {
    const chunks = [];
    for await (const chunk of client.cat(cid)) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    // UTF-8としてデコード
    const decodedData = buffer.toString('utf-8');

    const jsonData = JSON.parse(decodedData);
    console.log('IPFS上にアップロードした内容:');
    console.log(JSON.stringify(jsonData, null, 2)); // 整形してログ出力

  } catch (error) {
    console.error('Error retrieving file:', error);
  }
}

main("QmV35ABZxswz7BQ4pfgku6bZ3LgQSZmXTXCS8au1VaaHME");