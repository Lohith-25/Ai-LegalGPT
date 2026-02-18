const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'sample_test.pdf');

const doc = new PDFDocument();
const stream = fs.createWriteStream(outPath);
doc.pipe(stream);

doc.fontSize(20).text('Court Appearance Notice', { align: 'center' });
doc.moveDown();
doc.fontSize(12).text('This is a sample court appearance notice created for testing PDF parsing.');

doc.moveDown();
doc.text('Case No: 12345');
doc.text('Date: 01-Jan-2026');
doc.text('You are required to appear before the court on the above date.');

doc.end();

stream.on('finish', () => {
  console.log('Sample PDF created at:', outPath);
});
