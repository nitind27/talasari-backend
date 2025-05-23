const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const db = require('./db');
const fs = require('fs');
const https = require('https'); // <-- Add this line

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up multer storage with current timestamp filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}.jpg`);
  }
});
const upload = multer({ storage });

// Endpoint for complaint
app.post('/complaint', upload.single('images'), (req, res) => {
  const { latitude, longitude, ip_add, address, complaint } = req.body;
  const imageFilename = req.file.filename;

  const query = `INSERT INTO complaint (images, latitude, longitude, ip_add, address, complaint) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [imageFilename, latitude, longitude, ip_add, address, complaint], (err, result) => {
    if (err) {
      console.error('Error inserting complaint:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Complaint submitted successfully', filename: imageFilename });
  });
});

app.get('/complaint', (req, res) => {
  const query = `SELECT * FROM complaint ORDER BY id DESC`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching complaints:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    // Optionally, you can add the image URL for frontend usage
    const complaints = results.map(row => ({
      ...row,
      imageUrl: row.images ? `${req.protocol}://${req.get('host')}/uploads/${row.images}` : null
    }));
    res.json(complaints);
  });
});

// ==================== SSL/HTTPS PART STARTS HERE ====================

// SSL certificate files (replace with your actual paths)
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
};

// Start HTTPS server on 0.0.0.0:5000 (accessible from outside)
https.createServer(sslOptions, app).listen(5000, '0.0.0.0', () => {
  console.log('HTTPS server running on https://194.164.150.54:5000');
});

// ===================== REMOVE app.listen() ==========================
// Remove or comment out any plain app.listen() lines
// app.listen(5000, () => { ... });
// app.listen(5000, '0.0.0.0', () => { ... });
// ====================================================================

