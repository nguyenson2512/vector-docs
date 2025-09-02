const fs = require('fs');
const pdfParse = require('pdf-parse');

async function extractText(filePath, fileType) {
  if (fileType === 'pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else if (fileType === 'txt') {
    return fs.readFileSync(filePath, 'utf8');
  } else {
    throw new Error('Unsupported file type');
  }
}

module.exports = { extractText };