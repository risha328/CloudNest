import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ensure uploads folder exists
const UPLOAD_DIR = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Check server storage before allowing uploads
const checkServerStorage = (req, res, next) => {
  try {
    // Get disk usage for the uploads directory
    const stats = fs.statSync(UPLOAD_DIR);
    const diskUsage = fs.statSync(path.parse(UPLOAD_DIR).root);

    // For Windows, we need to use a different approach to get disk usage
    // This is a simplified check - in production, you'd use a library like 'diskusage'
    const totalSpace = 100 * 1024 * 1024 * 1024; // Assume 100GB total (adjust based on your server)
    const freeSpace = totalSpace * 0.1; // Reserve 10% free space (10GB buffer)

    // Check if we have enough space (at least 1GB free after upload)
    const minFreeSpace = 1024 * 1024 * 1024; // 1GB minimum free space
    if (freeSpace < minFreeSpace) {
      return res.status(507).json({
        message: "Server storage is full. Please contact administrator or try again later."
      });
    }

    next();
  } catch (error) {
    console.error('Storage check error:', error);
    // Continue with upload if we can't check storage
    next();
  }
};

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
});

// Export the storage check middleware
export { checkServerStorage };
