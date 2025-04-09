import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Free-use stock images from Pexels (all available under license for free use)
const imageUrls = [
  // Ouarzazate Solar Power Station (Noor), Morocco
  {
    url: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=1200',
    destination: 'ouarzazate-solar.jpg'
  },
  // Olkaria Solar Manufacturing Park
  {
    url: 'https://images.pexels.com/photos/159397/solar-panel-array-power-sun-electricity-159397.jpeg?auto=compress&cs=tinysrgb&w=1200',
    destination: 'olkaria-solar.jpg'
  },
  // Riverine Gold Extraction Project
  {
    url: 'https://images.pexels.com/photos/6646989/pexels-photo-6646989.jpeg?auto=compress&cs=tinysrgb&w=1200',
    destination: 'riverine-gold.jpg'
  },
  // Artisanal Mining Modernization
  {
    url: 'https://images.pexels.com/photos/6646921/pexels-photo-6646921.jpeg?auto=compress&cs=tinysrgb&w=1200',
    destination: 'artisanal-mining.jpg'
  },
  // Lake Turkana Wind Power
  {
    url: 'https://images.pexels.com/photos/994815/pexels-photo-994815.jpeg?auto=compress&cs=tinysrgb&w=1200',
    destination: 'lake-turkana-wind.jpg'
  },
  // Kampala Affordable Housing Project
  {
    url: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1200',
    destination: 'kampala-housing.jpg'
  }
];

// Create directory if it doesn't exist
const directory = path.resolve(__dirname);
if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory, { recursive: true });
}

// Download images
imageUrls.forEach(({ url, destination }) => {
  const filePath = path.join(directory, destination);
  const file = fs.createWriteStream(filePath);
  
  console.log(`Downloading ${url} to ${filePath}...`);
  
  https.get(url, (response) => {
    // Check if response is successful
    if (response.statusCode !== 200) {
      console.error(`Failed to download ${url}: Status code ${response.statusCode}`);
      file.close();
      fs.unlinkSync(filePath); // Remove the file
      return;
    }
    
    // Pipe the response to the file
    response.pipe(file);
    
    file.on('finish', () => {
      file.close();
      console.log(`Successfully downloaded ${destination}`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${url}: ${err.message}`);
    file.close();
    fs.unlinkSync(filePath); // Remove the file
  });
});