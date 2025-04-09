import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Free-use stock images from Unsplash and Pixabay (all available under license for free use)
const imageUrls = [
  // Ouarzazate Solar Power Station (Noor), Morocco
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Ouarzazate_Solar_Power_Station_in_February_2019.jpg/1024px-Ouarzazate_Solar_Power_Station_in_February_2019.jpg',
    destination: 'ouarzazate-solar.jpg'
  },
  // Olkaria Solar Manufacturing Park
  {
    url: 'https://images.unsplash.com/photo-1594818379496-da1e345aa0f0?w=1200&auto=format&fit=crop&q=80',
    destination: 'olkaria-solar.jpg'
  },
  // Riverine Gold Extraction Project
  {
    url: 'https://images.unsplash.com/photo-1518181835702-6eef441b70d2?w=1200&auto=format&fit=crop&q=80',
    destination: 'riverine-gold.jpg'
  },
  // Artisanal Mining Modernization
  {
    url: 'https://images.pexels.com/photos/6260293/pexels-photo-6260293.jpeg?w=1200&auto=compress&cs=tinysrgb&dpr=2',
    destination: 'artisanal-mining.jpg'
  },
  // Lake Turkana Wind Power
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Lake_Turkana_Wind_Power_Station.jpg/1280px-Lake_Turkana_Wind_Power_Station.jpg',
    destination: 'lake-turkana-wind.jpg'
  },
  // Grootvlei Solar Power Project
  {
    url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&auto=format&fit=crop&q=80',
    destination: 'grootvlei-solar.jpg'
  },
  // Generic projects
  {
    url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1200&auto=format&fit=crop&q=80',
    destination: 'nairobi-waste.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1488409688217-e6053b1e8f42?w=1200&auto=format&fit=crop&q=80',
    destination: 'lagos-transport.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1556156653-e5a7c69cc4c5?w=1200&auto=format&fit=crop&q=80',
    destination: 'kampala-housing.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=1200&auto=format&fit=crop&q=80',
    destination: 'tamale-water.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1553434320-e9f5757140b1?w=1200&auto=format&fit=crop&q=80',
    destination: 'addis-light-rail.jpg'
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