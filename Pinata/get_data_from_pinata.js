import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env', override: true });

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

async function getPinataFileInfo(fileName) {
  const url = `https://api.pinata.cloud/data/pinList?status=pinned&metadata[name]=${fileName}`;

  try {
    const response = await axios.get(url, {
      headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey
      }
    });

    if (response.data.count > 0) {
      return response.data.rows[0].ipfs_pin_hash;
    } else {
      throw new Error(`File ${fileName} not found on Pinata`);
    }
  } catch (error) {
    console.error('Error fetching file info from Pinata:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function fetchIPFSFile(cid) {
  const url = `https://gateway.pinata.cloud/ipfs/${cid}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching file from IPFS:', error.response ? error.response.data : error.message);
    throw error;
  }
}

function displayTouristSpots(spots) {
  console.log('\n観光スポット一覧:\n');
  spots.forEach((spot, index) => {
    console.log(`${index + 1}. ${spot.name}`);
    console.log(`   場所: ${spot.location}`);
    console.log(`   説明: ${spot.description}`);
    console.log('   アトラクション:');
    spot.attractions.forEach(attraction => {
      console.log(`     - ${attraction}`);
    });
    console.log();
  });
}

async function fetchAndDisplayTouristSpots() {
  try {
    const fileName = 'tourist_spots.json';
    const cid = await getPinataFileInfo(fileName);
    console.log(`CID for ${fileName}: ${cid}`);

    const fileContent = await fetchIPFSFile(cid);
    
    if (typeof fileContent === 'string') {
      // If the content is a string, parse it as JSON
      const jsonData = JSON.parse(fileContent);
      displayTouristSpots(jsonData.tourist_spots);
    } else if (typeof fileContent === 'object' && fileContent.tourist_spots) {
      // If the content is already an object, use it directly
      displayTouristSpots(fileContent.tourist_spots);
    } else {
      throw new Error('Unexpected data format');
    }
  } catch (error) {
    console.error('Error fetching and displaying tourist spots:', error);
  }
}

// 実行
fetchAndDisplayTouristSpots()
  .then(() => console.log('処理が完了しました。'))
  .catch(error => console.error('エラーが発生しました:', error));