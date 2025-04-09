import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lake Turkana Wind Power
const imageUrl = 'https://images.pexels.com/photos/2121331/pexels-photo-2121331.jpeg?auto=compress&cs=tinysrgb&w=1200';
const destination = 'lake-turkana-wind.jpg';

// Create directory if it doesn't exist
const directory = path.resolve(__dirname);
if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory, { recursive: true });
}

// Download image
const filePath = path.join(directory, destination);
const file = fs.createWriteStream(filePath);

console.log(`Downloading ${imageUrl} to ${filePath}...`);

https.get(imageUrl, (response) => {
  // Check if response is successful
  if (response.statusCode !== 200) {
    console.error(`Failed to download ${imageUrl}: Status code ${response.statusCode}`);
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
  console.error(`Error downloading ${imageUrl}: ${err.message}`);
  file.close();
  fs.unlinkSync(filePath); // Remove the file
});