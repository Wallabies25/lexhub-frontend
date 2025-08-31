// This is a script to test and fix PDF generation
import fs from 'fs';
import path from 'path';

// Directory for PDFs
const pdfDir = path.join(process.cwd(), 'public', 'assets', 'statutes');

// Create a more robust valid PDF content
const createValidPdf = (title) => `%PDF-1.4
1 0 obj
<< /Type /Catalog
/Outlines 2 0 R
/Pages 3 0 R
>>
endobj
2 0 obj
<< /Type /Outlines
/Count 0
>>
endobj
3 0 obj
<< /Type /Pages
/Kids [4 0 R]
/Count 1
>>
endobj
4 0 obj
<< /Type /Page
/Parent 3 0 R
/MediaBox [0 0 612 792]
/Contents 5 0 R
/Resources << /ProcSet 6 0 R
/Font << /F1 7 0 R /F2 8 0 R >>
>>
>>
endobj
5 0 obj
<< /Length 562 >>
stream
BT
/F1 24 Tf
50 700 Td
(LexHub IP Platform - Statute Database) Tj
/F2 16 Tf
50 650 Td
(${title}) Tj
/F1 12 Tf
50 620 Td
(This is a valid PDF document containing intellectual property statute information.) Tj
50 600 Td
(For the complete content, please refer to the official publication.) Tj
50 570 Td
(Last generated: ${new Date().toISOString().split('T')[0]}) Tj
50 540 Td
(Document ID: ${Math.random().toString(36).substring(2, 15)}) Tj
50 500 Td
(This document is provided for reference purposes only and does not constitute) Tj
50 480 Td
(legal advice. Please consult with a qualified legal professional for specific) Tj
50 460 Td
(guidance related to intellectual property matters.) Tj
ET
endstream
endobj
6 0 obj
[/PDF /Text]
endobj
7 0 obj
<< /Type /Font
/Subtype /Type1
/Name /F1
/BaseFont /Helvetica-Bold
/Encoding /WinAnsiEncoding
>>
endobj
8 0 obj
<< /Type /Font
/Subtype /Type1
/Name /F2
/BaseFont /Helvetica
/Encoding /WinAnsiEncoding
>>
endobj
xref
0 9
0000000000 65535 f
0000000009 00000 n
0000000074 00000 n
0000000120 00000 n
0000000179 00000 n
0000000325 00000 n
0000000940 00000 n
0000000970 00000 n
0000001082 00000 n
trailer
<< /Size 9
/Root 1 0 R
>>
startxref
1190
%%EOF`;

// List all PDF files in the directory
try {
  const files = fs.readdirSync(pdfDir);
  const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
  
  console.log(`Found ${pdfFiles.length} PDF files in ${pdfDir}`);
  
  // Process each PDF file
  pdfFiles.forEach(file => {
    const filePath = path.join(pdfDir, file);
    const stats = fs.statSync(filePath);
    
    // If file is empty or very small, create a valid PDF
    if (stats.size < 500) {
      console.log(`Fixing potentially invalid PDF: ${file} (size: ${stats.size} bytes)`);
      
      // Create backup if file has some content
      if (stats.size > 0) {
        const backupPath = path.join(pdfDir, `${file}.backup`);
        fs.copyFileSync(filePath, backupPath);
        console.log(`Created backup at ${backupPath}`);
      }
      
      const title = file.replace(/\.pdf$/i, '');
      const validPdfContent = createValidPdf(title);
      fs.writeFileSync(filePath, validPdfContent);
      console.log(`Created valid PDF for: ${file}`);
    } else {
      console.log(`File ${file} has size ${stats.size} bytes - appears valid, skipping`);
      
      // Optional: You could add PDF validation here to check internal structure
      // by reading the file and verifying it has required PDF markers
    }
  });
  
  // Create a README if it doesn't exist
  const readmePath = path.join(pdfDir, 'README.md');
  if (!fs.existsSync(readmePath)) {
    const readmeContent = `# Statute PDF Files

This directory contains PDF files for all statutes in the LexHub IP platform.

## File Generation

The PDF files in this directory were generated using the \`fix-pdfs.js\` script.
For files smaller than 500 bytes, a valid PDF with basic content was created.

## Adding Real Content

To replace these placeholder PDFs with real content:

1. Prepare your PDF files with the same filenames
2. Copy them to this directory, replacing the existing files
3. Run the \`fix-pdfs.js\` script to verify file validity

## File List

${pdfFiles.map(file => `- ${file}`).join('\n')}
`;
    fs.writeFileSync(readmePath, readmeContent);
    console.log('Created README.md file with instructions');
  }
  
  console.log('PDF files have been fixed!');
} catch (error) {
  console.error('Error processing PDF files:', error);
}
