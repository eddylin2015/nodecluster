const http = require('http');
const fs = require('fs');
const path = require('path');
const { StringDecoder } = require('string_decoder');

const server = http.createServer((req, res) => {
  if (req.url === '/upload' && req.method === 'POST') {
    handleFileUpload(req, res);
  } else {
    serveUploadForm(req, res);
  }
});

function handleFileUpload(req, res) {
  const boundary = req.headers['content-type'].split('=')[1];
  const chunks = [];
  let fileCount = 0;

  req.on('data', (chunk) => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    const buffer = Buffer.concat(chunks);
    const parts = parseMultipart(buffer, boundary);
    
    // Create upload directory if it doesn't exist
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    parts.forEach((part) => {
      if (part.filename) {
        fileCount++;
        const filePath = path.join(uploadDir, part.filename);
        fs.writeFileSync(filePath, part.data);
      }
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: `${fileCount} file(s) uploaded successfully`
    }));
  });
}

function parseMultipart(buffer, boundary) {
  const parts = [];
  let currentPart = {};
  let position = 0;

  // Convert boundary to buffer
  const boundaryBuffer = Buffer.from(`--${boundary}`);

  while (position < buffer.length) {
    // Find the boundary position
    const boundaryPos = buffer.indexOf(boundaryBuffer, position);
    if (boundaryPos === -1) break;

    // Extract headers between position and boundary
    const headersEnd = buffer.indexOf('\r\n\r\n', position);
    if (headersEnd === -1) break;

    const headers = buffer.slice(position, headersEnd).toString();
    const headerLines = headers.split('\r\n');

    // Parse headers
    headerLines.forEach(line => {
      if (line.includes('Content-Disposition')) {
        const nameMatch = line.match(/name="([^"]+)"/);
        const filenameMatch = line.match(/filename="([^"]+)"/);
        
        if (nameMatch) currentPart.name = nameMatch[1];
        if (filenameMatch) currentPart.filename = filenameMatch[1];
      }
    });

    // Extract data (between headers and boundary)
    const dataStart = headersEnd + 4;
    const dataEnd = boundaryPos - 2; // minus \r\n

    if (dataStart < dataEnd) {
      currentPart.data = buffer.slice(dataStart, dataEnd);
      parts.push(currentPart);
    }

    currentPart = {};
    position = boundaryPos + boundaryBuffer.length + 2; // skip boundary and \r\n
  }

  return parts;
}

function serveUploadForm(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>File Upload</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        form { border: 1px solid #ddd; padding: 20px; max-width: 500px; }
      </style>
    </head>
    <body>
      <h1>File Upload</h1>
      <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="filefield" multiple><br><br>
        <button type="submit">Upload</button>
      </form>
    </body>
    </html>
  `);
}

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Upload directory: ./uploads');
});