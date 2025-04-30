
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Create a function to ensure upload directories exist
const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Created directory: ${directory}`);
  }
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = req.body.path || '/tmp/uploads';
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Handle file upload endpoint
app.post('/api/upload', (req, res) => {
  // We need to handle the path parameter before multer processes the file
  const uploadPath = req.query.path || '/tmp/uploads';
  const permissions = req.query.permissions || '644';
  
  // Create custom multer instance for this specific request
  const customStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      ensureDirectoryExists(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
  
  const customUpload = multer({ storage: customStorage }).single('file');
  
  customUpload(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: err.message || 'Error uploading file' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Set file permissions if specified
    try {
      const filePath = path.join(uploadPath, req.file.originalname);
      fs.chmodSync(filePath, parseInt(permissions, 8));
      
      return res.status(200).json({
        message: 'File uploaded successfully',
        file: {
          name: req.file.originalname,
          size: req.file.size,
          path: filePath,
          permissions
        }
      });
    } catch (error) {
      console.error('Permission error:', error);
      return res.status(500).json({ error: error.message || 'Error setting file permissions' });
    }
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
