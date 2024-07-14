import { create } from 'kubo-rpc-client';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Kubo IPFSノードの接続情報を設定
const ipfs = create({
  host: 'localhost',
  port: 5001,
  protocol: 'http'
});

// NFTメタデータをIPFSにアップロードする関数
async function uploadNFTMetadataToIPFS(metadata) {
  try {
    const result = await ipfs.add(JSON.stringify(metadata));
    return result.cid.toString();
  } catch (error) {
    console.error(`Error uploading metadata: ${error.message}`);
    throw error;
  }

};

// フォルダ内すべてのJSONファイルを処理する関数
async function processNFTDataFolder(folderPath) {
  try {
    // 指定したフォルダ内のファイルを読み込んでfilesに格納
    const files = await fs.readdir(folderPath);
    for (const file of files) {
      // ファイルの形式がJSONか判別
      if (path.extname(file).toLocaleLowerCase() === '.json') {
        const filePath = path.join(folderPath, file);
        const jsonData = JSON.parse(await fs.readFile(filePath, 'utf8'));

        const cid = await uploadNFTMetadataToIPFS(jsonData);
        console.log(`Uploaded metadata for ${jsonData.name}. CID: ${cid}`);

        // メタデータをピン止め
        await ipfs.pin.add(cid);
        console.log(`Pinned metadata for ${jsonData.name}. CID: ${cid}`);
      }
    }
  } catch (error) {
    console.error(`Error processing NFT data folder: ${error.message}`);
  }
};

// メイン処理
const folderPath = path.join(__dirname, 'NFTData');
console.log(`Processing NFT data in folder: ${folderPath}`);

try {
  await processNFTDataFolder(folderPath);
  console.log('All NFT metadata processed and uploaded successfully');
} catch (error) {
  console.log('Error in main process: ', error);
}