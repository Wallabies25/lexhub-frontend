# Statute PDF Documents

This directory contains PDF files for the LexHub IP platform's Statute Database feature.

## Adding PDF Files

To add real PDF documents to this directory, follow these steps:

1. Obtain the PDF file for the intellectual property law document
2. Name the file exactly as referenced in the `statuteDocuments` array in `StatutePage.tsx`
3. Place the file in this directory

## Available Documents

The system is configured to work with the following document filenames:

- `Berne Convention.pdf`
- `Computer Crimes Act, No. 24 of 2007.pdf`
- `Customs Ordinance.pdf`
- `Electronic Transactions Act, No. 19 of 2006.pdf`
- `Geographical Indications Regulations – Gazette (Extraordinary, 22 Oct 2024).pdf`
- `Madrid Protocol.pdf`
- `Sri Lanka–USA Bilateral Agreement on the Protection of Intellectual Property (1991).pdf`
- `Trademark Law Treaty.pdf`
- `UPOV Convention (plant variety protection).pdf`
- `WTO Agreement on Trade-Related Aspects of Intellectual Property Rights (TRIPS).pdf`

## How Downloads Work

When a user clicks the download button in the application:

1. The browser requests the file from `/assets/statutes/{filename}`
2. The file is served directly from this directory
3. The browser initiates the download

## Troubleshooting

If downloads are not working, check the following:

1. Verify that the PDF file exists in this directory
2. Ensure the filename exactly matches the name used in the application
3. Check the browser console for any error messages
4. Verify that the file has appropriate read permissions
