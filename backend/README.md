
# File Upload Server

This is a simple Express.js server that handles file uploads for the Lovable File Upload project.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```
   
   For development with auto-reload:
   ```
   npm run dev
   ```

## API Endpoints

### POST /api/upload

Uploads a file to the specified path with specified permissions.

**Query Parameters:**
- `path` (optional): The directory path where the file should be saved (default: `/tmp/uploads`)
- `permissions` (optional): File permissions in octal format (default: `644`)

**Form Data:**
- `file`: The file to upload

**Response:**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "name": "filename.ext",
    "size": 12345,
    "path": "/path/to/file/filename.ext",
    "permissions": "777"
  }
}
```

## Important Notes

- The server needs appropriate permissions to write to the specified directories
- For production use, additional security measures should be implemented
- Maximum file size is determined by Express and Multer defaults
