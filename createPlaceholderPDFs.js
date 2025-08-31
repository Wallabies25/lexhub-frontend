// This script creates placeholder PDF files for testing
// Run this with Node.js

const fs = require('fs');
const path = require('path');

// List of document filenames from StatutePage.tsx
const documentFileNames = [
  'Berne Convention.pdf',
  'Computer Crimes Act, No. 24 of 2007.pdf',
  'Customs Ordinance.pdf',
  'Electronic Transactions Act, No. 19 of 2006.pdf',
  'Geographical Indications Regulations – Gazette (Extraordinary, 22 Oct 2024).pdf',
  'Madrid Protocol.pdf',
  'Sri Lanka–USA Bilateral Agreement on the Protection of Intellectual Property (1991).pdf',
  'Trademark Law Treaty.pdf',
  'UPOV Convention (plant variety protection).pdf',
  'WTO Agreement on Trade-Related Aspects of Intellectual Property Rights (TRIPS).pdf'
];

// Directory path - use absolute path
const statutesDir = path.resolve('public/assets/statutes');

console.log(`Target directory: ${statutesDir}`);

// Ensure the directory exists
if (!fs.existsSync(statutesDir)) {
  fs.mkdirSync(statutesDir, { recursive: true });
  console.log(`Created directory: ${statutesDir}`);
} else {
  console.log(`Directory already exists: ${statutesDir}`);
}

// Create empty placeholder files
documentFileNames.forEach(fileName => {
  const filePath = path.join(statutesDir, fileName);
  try {
    fs.writeFileSync(filePath, ''); // Creates an empty file
    console.log(`Created placeholder file: ${fileName}`);
  } catch (error) {
    console.error(`Error creating file ${fileName}:`, error);
  }
});

console.log('Done creating placeholder PDF files.');
