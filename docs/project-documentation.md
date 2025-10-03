# CloudNest Project Documentation

## 🌩️ Project Overview

CloudNest is a **secure, password-based file storage and sharing platform** built with the MERN stack. It allows users to upload images, videos, and audio files, protect them with passwords, and share them safely. Only users with the correct password can access the files.

The platform provides enterprise-grade security features including malware scanning, encrypted storage, and granular permission controls. It's designed for users who need secure file sharing without relying on third-party cloud services.

## 🚀 Features

### Core Features

#### 🔐 User Authentication
- **User Registration**: Create accounts with email and password
- **User Login**: Secure JWT-based authentication
- **Profile Management**: View and manage user profiles
- **Protected Routes**: Client-side route protection for authenticated users

#### 📁 File Management
- **Secure File Upload**: Upload files with optional password protection
- **Expiry Dates**: Set automatic expiration for shared files
- **Download Limits**: Control maximum number of downloads per file
- **File Organization**: Organize files into folders
- **Inline Viewing**: View files directly in the browser
- **File Downloads**: Secure download functionality
- **File Deletion**: Remove files permanently
- **File Analytics**: Track views, downloads, and access patterns

#### 📂 Folder Management
- **Create Folders**: Organize files into hierarchical folders
- **Folder Permissions**: Share entire folders with other users
- **Bulk Operations**: Manage multiple files within folders
- **Folder Analytics**: Track folder-level statistics

#### 🔑 Permission System
- **Granular Access Control**: Three permission levels (Viewer, Downloader, Editor)
- **User Sharing**: Share files and folders with specific users
- **Permission Management**: Grant and revoke permissions dynamically
- **Role-Based Access**: Different access levels for different user types

#### 🛡️ Security Features
- **Malware Scanning**: Automatic virus scanning using ClamScan
- **Password Protection**: Optional password protection for files
- **Failed Attempt Tracking**: Monitor and limit access attempts
- **File Blocking**: Admin capability to block malicious files
- **Secure Links**: Password-protected sharing links

#### 📊 Analytics & Monitoring
- **File Statistics**: Detailed metrics for individual files
- **Folder Analytics**: Aggregate statistics for folders
- **Storage Usage**: Monitor storage consumption
- **Platform Stats**: Admin dashboard with system-wide metrics
- **Access Logs**: Track file access timestamps

#### 👥 User Management
- **User Search**: Find users by name or email
- **User Profiles**: View detailed user information
- **Admin Controls**: Administrative user management

#### 🎨 User Interface
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Built with Tailwind CSS
- **Intuitive Dashboard**: Easy file and folder management
- **Modal Interfaces**: Clean upload and sharing dialogs
- **Real-time Updates**: Dynamic UI updates

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Virus Scanning**: ClamScan
- **CORS**: cors middleware
- **Environment**: dotenv

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: React Context API

### Infrastructure
- **Database**: MongoDB Atlas (Cloud)
- **File Storage**: Local filesystem (configurable for S3)
- **Deployment**: Configurable for various platforms

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- ClamAV antivirus (for malware scanning)
- npm or yarn package manager

## 🚀 Installation and Setup

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cloudnest/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cloudnest
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

4. **Install ClamAV** (for malware scanning)
   - Windows: Download from https://www.clamav.net/downloads
   - Linux/Mac: Use package manager
   ```bash
   # Ubuntu/Debian
   sudo apt-get install clamav

   # macOS
   brew install clamav
   ```

5. **Start the server**
   ```bash
   npm run dev  # Development mode
   npm start    # Production mode
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Register a new user.
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### POST /api/auth/login
Authenticate user.
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user profile (requires authentication).

### File Endpoints

#### POST /api/files
Upload a file (requires authentication).
- Form data: `file`, `password` (optional), `expiresAt` (optional), `folderId` (optional)

#### GET /api/files/:id
Get file metadata (owner only).

#### POST /api/files/:id/access
Verify password and get access URLs.
```json
{
  "password": "filepassword"
}
```

#### GET /api/files/:id/view
View file inline (requires permission).

#### GET /api/files/:id/download
Download file (requires permission).

#### DELETE /api/files/:id
Delete file (owner only).

#### PUT /api/files/:id/expiry
Update file expiry settings.
```json
{
  "expiresAt": "2024-12-31T23:59:59Z",
  "maxDownloads": 100
}
```

#### PUT /api/files/:id/password
Reset file password.
```json
{
  "newPassword": "newpassword"
}
```

#### GET /api/files
Get files by folder (requires folder permission).

#### GET /api/files/storage/stats
Get user storage statistics.

#### GET /api/files/:id/stats
Get file statistics (owner only).

### Folder Endpoints

#### POST /api/folders
Create a new folder.
```json
{
  "name": "My Folder"
}
```

#### GET /api/folders
Get all user folders with file counts.

#### DELETE /api/folders/:id
Delete folder and all contents (owner only).

### Permission Endpoints

#### POST /api/permissions/grant
Grant permission to a resource.
```json
{
  "userId": "user_id",
  "resourceId": "resource_id",
  "resourceType": "file|folder",
  "role": "viewer|downloader|editor"
}
```

#### DELETE /api/permissions/:resourceType/:resourceId/revoke/:userId
Revoke permission from a resource.

#### GET /api/permissions/:resourceType/:resourceId
Get permissions for a resource.

### User Endpoints

#### GET /api/users/search
Search users by name or email.
Query: `?query=searchterm`

#### GET /api/users/:id
Get user by ID.

### Admin Endpoints (Admin only)

#### GET /api/admin/files
Get all files on platform.

#### DELETE /api/admin/files/:id
Delete file (admin override).

#### GET /api/admin/stats
Get platform statistics.

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  role: String (enum: ["user", "admin"], default: "user")
}
```

### File Model
```javascript
{
  ownerId: ObjectId (ref: "User"),
  folderId: ObjectId (ref: "Folder"),
  originalName: String (required),
  storageName: String (required),
  path: String (required),
  mimeType: String,
  size: Number,
  passwordHash: String,
  downloadCount: Number (default: 0),
  viewCount: Number (default: 0),
  downloadTimestamps: [Date],
  viewTimestamps: [Date],
  maxDownloads: Number,
  expiresAt: Date,
  blocked: Boolean (default: false),
  failedAttempts: Number (default: 0)
}
```

### Folder Model
```javascript
{
  ownerId: ObjectId (ref: "User", required),
  name: String (required)
}
```

### Permission Model
```javascript
{
  userId: ObjectId (ref: "User"),
  resourceId: ObjectId,
  resourceType: String (enum: ["file", "folder"]),
  role: String (enum: ["viewer", "downloader", "editor"]),
  grantedBy: ObjectId (ref: "User")
}
```

## 🔄 Project Structure

```
cloudnest/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── fileController.js
│   │   ├── folderController.js
│   │   ├── permissionController.js
│   │   ├── userController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── File.js
│   │   ├── Folder.js
│   │   └── Permission.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── fileRoutes.js
│   │   ├── folderRoutes.js
│   │   ├── permissionRoutes.js
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── config/
│   │   └── db.js
│   ├── services/
│   ├── uploads/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── Pricing.jsx
│   │   │   ├── Security.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── FileView.jsx
│   │   │   ├── FileAnalytics.jsx
│   │   │   ├── Featurespage.jsx
│   │   │   ├── HowItWorkspage.jsx
│   │   │   ├── SecurityPage.jsx
│   │   │   ├── PricingPage.jsx
│   │   │   ├── Blog.jsx
│   │   │   └── Contact.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   └── package.json
├── docs/
│   └── project-documentation.md
└── README.md
```

## 🔮 Future Roadmap

### Phase 1 (Current - MVP)
- ✅ Basic file upload and password protection
- ✅ Folder organization
- ✅ Permission system
- ✅ Malware scanning
- ✅ Admin dashboard

### Phase 2 (In Development)
- 🔄 Resumable uploads for large files
- 🔄 Client-side encryption (zero-knowledge mode)
- 🔄 File previews and thumbnails
- 🔄 Advanced analytics and reporting
- 🔄 Mobile app development

### Phase 3 (Future)
- 📋 Paid tiers and enterprise features
- 📋 Team collaboration tools
- 📋 Integration with external storage providers (S3, Google Drive)
- 📋 Advanced sharing options (public links, embed codes)
- 📋 API for third-party integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@cloudnest.com or join our Discord community.

---

**CloudNest** - Secure file sharing made simple.
