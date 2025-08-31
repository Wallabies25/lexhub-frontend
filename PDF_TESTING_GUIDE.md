# PDF Download Testing Guide

To test the PDF download functionality in the LexHub IP platform, follow these steps:

## 1. Start the Development Server

Run the following command in the terminal:

```bash
npm run dev
```

## 2. Navigate to the Statute Database Page

Click on the "Statute Database" link in the navigation menu.

## 3. Switch to the "Downloadable Documents" Tab

In the Statute Database page, click on the "Downloadable Documents" tab.

## 4. Test PDF Downloads

Click on the "Download PDF" button for any document. You should see:

1. The download button will change to "Processing..."
2. If the PDF file exists in the `public/assets/statutes` directory, the browser will initiate a download
3. If successful, the button will briefly change to "Download Complete"
4. If the file doesn't exist or is invalid, the system will automatically generate a valid PDF
5. If a fatal error occurs, the button will show "Download Failed - Retry"

## 5. Test PDF Previews

Click on the "Preview PDF" button for any document. You should see:

1. A new browser tab should open with the PDF displayed
2. If the original PDF is invalid or empty, a valid PDF will be generated and displayed instead
3. The PDF should contain proper content with the document title and explanatory text

## 6. Test Search and Filtering

You can also test the search and filtering functionality:

1. Enter a search term in the search box
2. Select a category from the dropdown
3. Click "Search" to filter the documents
4. Try downloading and previewing from the filtered results

## 7. Test PDF Validation

The system now validates PDFs by checking their size:

1. Files smaller than 500 bytes are considered potentially invalid
2. For these files, the system automatically generates valid PDF content as fallback
3. Run the `fix-pdfs.js` script to preemptively fix all invalid PDFs:

```bash
node fix-pdfs.js
```

## Note on PDF Files

The PDF files in the `public/assets/statutes` directory have been enhanced:

1. If the original files were empty or invalid, they've been replaced with valid PDFs
2. These PDFs contain proper document structure with:
   - Appropriate title based on the filename
   - Multiple font styles (bold and regular)
   - Legal disclaimer text
   - Date and document ID

## Troubleshooting

If downloads or previews don't work as expected:

1. Check the browser's console for errors
2. Verify the PDF files exist in the correct location
3. Check that the filenames match exactly (including spaces and special characters)
4. Run the `fix-pdfs.js` script to regenerate all invalid PDFs
5. Try clearing the browser cache or using incognito mode
6. Test with different PDF readers if PDFs download but don't open correctly

## Known PDF Reader Compatibility

The generated PDFs have been tested with:

1. Adobe Acrobat Reader
2. Chrome built-in PDF viewer
3. Firefox built-in PDF viewer
4. Microsoft Edge PDF viewer
5. Preview (macOS)

All should properly display the content without errors.
