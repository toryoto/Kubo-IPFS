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

// 画像をIPFSにアップロードする関数
async function uploadImageToIPFS(imagePath) {
  try {
    const file = await fs.readFile(imagePath);
    const result = await ipfs.add({ path: imagePath, content: file });
    console.log(`File uploaded successfully. CID: ${result.cid}`);
    return result.cid.toString();
  } catch (error) {
    console.error(`Error uploading file: ${error.message}`);
    throw error;
  }
}

// フォルダ内の全ての画像をアップロードする関数
async function uploadImagesFromFolder(folderPath) {
  // アップロードした画像を格納するリスト
  const uploadedImages = [];

  try {
    const files = await fs.readdir(folderPath);
    
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = await fs.stat(filePath);
      
      if (stats.isFile() && isImageFile(file)) {
        const cid = await uploadImageToIPFS(filePath);
        uploadedImages.push({ fileName: file, cid: cid });
        
        // 画像をピン留めする
        // データの永続性確保
        await ipfs.pin.add(cid);
        console.log(`Pinned image: ${file}. CID: ${cid}`);
      }
    }
  } catch (error) {
    console.error(`Error processing folder: ${error.message}`);
  }

  return uploadedImages;
}

// ファイルが画像かどうかを判断する関数
function isImageFile(fileName) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  const ext = path.extname(fileName).toLowerCase();
  return imageExtensions.includes(ext);
}

// imagesフォルダを指定
const folderPath = path.join(__dirname, 'images');
console.log(`Processing images in folder: ${folderPath}`);

try {
  const uploadedImages = await uploadImagesFromFolder(folderPath);
  console.log('Uploaded images:', uploadedImages);

  // アップロードされた全てのファイルのリストを表示
  console.log('Listing all uploaded files:');
  for await (const file of ipfs.files.ls('/')) {
    console.log(file.name, file.cid.toString());
  }
} catch (error) {
  console.error('Error in main process:', error);
}