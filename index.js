const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const db = require('./db');
const fs = require('fs');

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

// Purani line (jo aapke code me hai)
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

// Nayi line (jo lagani hai)
app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:5000');
});
