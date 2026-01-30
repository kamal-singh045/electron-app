# Electron App - Authentication & Profile Management Implementation Guide

## 📋 Overview

This document provides an in-depth explanation of the authentication and profile management system implemented in this Electron application. The system includes user registration, login, profile viewing, and profile image upload capabilities with camera and file system access.

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + React Router v6
- **Backend**: Express.js (runs in Electron main process)
- **Database**: SQLite3 (better-sqlite3)
- **Desktop Framework**: Electron 30
- **Build Tool**: Vite 5
- **Styling**: CSS3 (Custom)

### Application Structure
```
electron-app/
├── electron/               # Electron main process files
│   ├── main.ts            # Main process entry point
│   ├── preload.ts         # Preload scripts for renderer
│   └── permissions.ts     # Permission handlers (NEW)
├── src/                   # React application (renderer process)
│   ├── pages/            # Page components (NEW)
│   │   ├── Register.tsx  # Registration page
│   │   ├── Login.tsx     # Login page
│   │   └── Profile.tsx   # Profile page with image upload
│   ├── styles/           # CSS stylesheets (NEW)
│   │   ├── Auth.css      # Authentication pages styling
│   │   └── Profile.css   # Profile page styling
│   ├── App.tsx           # Main app with routing (MODIFIED)
│   └── main.tsx          # React entry point
├── server/               # Express server (runs in main process)
│   ├── server.ts         # Server initialization
│   ├── routes/           # API routes
│   ├── controllers/      # Request handlers
│   └── db/               # Database setup
└── package.json
```

---

## 🔐 Authentication Flow

### 1. User Registration (`/register`)

**File**: `src/pages/Register.tsx`

#### Features:
- Full name, email, phone number, and password collection
- Client-side validation:
  - All fields required
  - Password minimum 6 characters
  - Password confirmation match
- Form submission to backend API
- Redirect to login page on success

#### API Integration (To Be Implemented):
```typescript
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securepassword"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

### 2. User Login (`/login`)

**File**: `src/pages/Login.tsx`

#### Features:
- Email and password authentication
- Display success message from registration redirect
- Store user data and token in localStorage
- Automatic redirect to profile page on success

#### API Integration (To Be Implemented):
```typescript
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

### 3. Protected Routes

**File**: `src/App.tsx`

#### Implementation:
```typescript
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem('user');
  return user ? <>{children}</> : <Navigate to="/login" />;
}
```

#### How It Works:
1. Checks if user data exists in localStorage
2. If authenticated: renders the protected component
3. If not authenticated: redirects to `/login`

---

## 👤 Profile Management

### Profile Page (`/profile`)

**File**: `src/pages/Profile.tsx`

#### Features:
1. **User Information Display**
   - Name, email, and phone number
   - Profile image or placeholder with user's initial

2. **Profile Image Upload Options**
   - 📷 Camera capture
   - 🖼️ File selection from disk

3. **Session Management**
   - Logout functionality
   - Automatic redirect if not authenticated

---

## 📸 Image Upload System

### Option 1: Camera Capture

#### Implementation Details:
```typescript
const handleCameraCapture = async () => {
  // Request camera access
  const stream = await navigator.mediaDevices.getUserMedia({ 
    video: { width: 640, height: 480 } 
  });

  // Create video element
  const video = document.createElement('video');
  video.srcObject = stream;
  video.play();

  // Wait for video to be ready
  await new Promise((resolve) => {
    video.onloadedmetadata = resolve;
  });

  // Capture frame to canvas
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, 640, 480);
  
  // Convert to base64 JPEG
  const imageData = canvas.toDataURL('image/jpeg', 0.8);
  
  // Stop camera
  stream.getTracks().forEach(track => track.stop());
  
  // Save image
  await saveProfileImage(imageData);
}
```

#### Error Handling:
- **NotAllowedError**: Camera permission denied
- **NotFoundError**: No camera device found
- Generic errors with descriptive messages

### Option 2: File Selection

#### Implementation Details:
```typescript
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    setError('Please select a valid image file');
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    setError('Image size should be less than 5MB');
    return;
  }

  // Convert to base64
  const reader = new FileReader();
  reader.onload = async (event) => {
    const imageData = event.target?.result as string;
    await saveProfileImage(imageData);
  };
  reader.readAsDataURL(file);
}
```

#### Validations:
- File type must be an image (image/*)
- Maximum file size: 5MB
- Automatic conversion to base64 for storage

---

## 💾 Image Storage Strategy

### Current Implementation: Local Storage

**Storage Location**: Browser's localStorage
**Storage Key**: `profile_image_{userId}`
**Format**: Base64-encoded data URL

#### Advantages:
✅ No server-side implementation needed immediately
✅ Instant save/load without network requests
✅ Works offline
✅ Simple implementation

#### Limitations:
❌ Limited to ~5-10MB per domain
❌ Not synchronized across devices
❌ Can be cleared by user
❌ Not suitable for production at scale

### Recommended Production Implementation

#### Option 1: File System Storage (Desktop Native)

**Storage Location**: User's application data directory

```typescript
// In Electron main process
import { app } from 'electron';
import fs from 'fs/promises';
import path from 'path';

async function saveProfileImage(userId: number, imageData: Buffer) {
  const userDataPath = app.getPath('userData');
  const imagesDir = path.join(userDataPath, 'profile-images');
  
  // Create directory if it doesn't exist
  await fs.mkdir(imagesDir, { recursive: true });
  
  // Save image
  const imagePath = path.join(imagesDir, `user_${userId}.jpg`);
  await fs.writeFile(imagePath, imageData);
  
  return imagePath;
}
```

**Paths by Platform**:
- **macOS**: `~/Library/Application Support/YourAppName/profile-images/`
- **Windows**: `%APPDATA%/YourAppName/profile-images/`
- **Linux**: `~/.config/YourAppName/profile-images/`

#### Option 2: Server-Side Storage with Database Reference

**Database Schema Addition**:
```sql
ALTER TABLE users ADD COLUMN profile_image_path TEXT;
```

**API Endpoint** (To Be Implemented):
```typescript
POST /api/users/:userId/profile-image
Content-Type: multipart/form-data

FormData:
- image: File (binary)

Response:
{
  "success": true,
  "imagePath": "/uploads/profiles/user_1_1234567890.jpg"
}
```

**Server Implementation**:
```typescript
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user_${req.params.userId}_${Date.now()}${ext}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

router.post('/users/:userId/profile-image', 
  authenticateToken, 
  upload.single('image'),
  async (req, res) => {
    const { userId } = req.params;
    const imagePath = req.file.path;
    
    // Update database
    await db.prepare('UPDATE users SET profile_image_path = ? WHERE id = ?')
      .run(imagePath, userId);
    
    res.json({ success: true, imagePath });
  }
);
```

---

## 🔒 Permissions & Security

### Native Permissions Required

#### macOS Permissions

**File**: `electron-builder.json5`

```json5
{
  "mac": {
    "extendInfo": {
      "NSCameraUsageDescription": "This app requires access to the camera to capture profile pictures.",
      "NSMicrophoneUsageDescription": "This app requires access to the microphone for video calls."
    }
  }
}
```

**System Requirements**:
1. Camera access: Automatically prompted on first use
2. File system access: Handled by native file picker (no special permission needed)
3. User will see permission dialog on first camera access attempt

**Permission Location in macOS**:
- Settings → Privacy & Security → Camera → Enable for your app

#### Windows Permissions

**No manifest entries required** for basic functionality.

**System Requirements**:
1. Camera access: Handled by Windows Privacy Settings
2. File system access: Native file picker handles permissions automatically
3. Windows 10/11 will prompt user for camera access

**Permission Location in Windows**:
- Settings → Privacy → Camera → Allow desktop apps to access your camera

#### Linux Permissions

**No special configuration needed** for most distributions.

**System Requirements**:
1. Camera access via V4L2 (Video4Linux2)
2. File system access through native dialogs
3. May require user to be in 'video' group for camera access

**Grant Camera Access** (if needed):
```bash
sudo usermod -a -G video $USER
```

### Permission Handler Implementation

**File**: `electron/permissions.ts`

```typescript
import { session } from 'electron';

export function setupPermissions() {
  // Handle permission requests
  session.defaultSession.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      console.log(`Permission requested: ${permission}`);
      
      // Allow camera/microphone access
      if (permission === 'media') {
        callback(true);
        return;
      }
      
      // Deny by default
      callback(false);
    }
  );

  // Handle permission checks
  session.defaultSession.setPermissionCheckHandler(
    (webContents, permission, requestingOrigin) => {
      // Allow media access
      if (permission === 'media' || permission === 'mediaKeySystem') {
        return true;
      }
      
      return false;
    }
  );
}
```

**Integration in Main Process** (`electron/main.ts`):
```typescript
import { setupPermissions } from './permissions';

app.whenReady().then(async () => {
  setupPermissions(); // Must be called before creating windows
  await startServer();
  createWindow();
});
```

---

## 🔄 Data Flow

### Complete User Journey

```
1. App Launch
   ↓
2. Main Process: Start Express Server
   ↓
3. Main Process: Setup Permissions
   ↓
4. Main Process: Create Browser Window
   ↓
5. Renderer Process: Load React App
   ↓
6. React Router: Navigate to /login (default)
   ↓
7. User: Register or Login
   ↓
8. API Call: POST /api/auth/login
   ↓
9. Response: Store user + token in localStorage
   ↓
10. Navigate to /profile (protected route)
   ↓
11. Profile Page: Load user data from localStorage
   ↓
12. User: Upload Profile Image
    ├─> Option A: Camera Capture
    │   ↓
    │   Request camera permission
    │   ↓
    │   Capture frame from video stream
    │   ↓
    │   Convert to base64 JPEG
    │   ↓
    │   Save to localStorage
    │
    └─> Option B: File Selection
        ↓
        Open native file picker
        ↓
        Validate file type & size
        ↓
        Read file as base64
        ↓
        Save to localStorage
   ↓
13. Profile Image: Display in UI
   ↓
14. User: Logout
   ↓
15. Clear localStorage
   ↓
16. Navigate to /login
```

---

## 🛠️ API Integration Guide

### Required Backend Endpoints

#### 1. Register User
```
POST /api/auth/register
```

**Request Body**:
```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "phone": "string (required)",
  "password": "string (required, min 6 chars)"
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

**Response** (Error - 400):
```json
{
  "success": false,
  "message": "Email already exists"
}
```

#### 2. Login User
```
POST /api/auth/login
```

**Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "profileImage": "/uploads/profiles/user_1.jpg" // optional
  }
}
```

**Response** (Error - 401):
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### 3. Upload Profile Image (Optional)
```
POST /api/users/:userId/profile-image
```

**Request**:
- **Headers**: `Authorization: Bearer {token}`
- **Content-Type**: `multipart/form-data` or `application/json`

**Option A: Multipart Form Data** (Recommended for production):
```
FormData:
- image: File (binary)
```

**Option B: JSON with Base64**:
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "imagePath": "/uploads/profiles/user_1_1234567890.jpg"
}
```

#### 4. Get User Profile (Optional)
```
GET /api/users/:userId
```

**Request Headers**:
```
Authorization: Bearer {token}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "profileImage": "/uploads/profiles/user_1.jpg",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T15:45:00Z"
  }
}
```

---

## 🎨 UI/UX Features

### Authentication Pages

**Styling**: `src/styles/Auth.css`

#### Design Elements:
- Gradient background (purple theme)
- Centered card layout
- Smooth transitions and hover effects
- Inline form validation messages
- Loading states for async operations
- Responsive design

#### User Experience:
- Clear error messages
- Success messages with redirects
- Disabled buttons during loading
- Password confirmation validation
- Focus states for accessibility

### Profile Page

**Styling**: `src/styles/Profile.css`

#### Design Elements:
- Circular profile image display
- Placeholder with user's initial
- Gradient border around profile picture
- Dropdown upload options menu
- Clean information cards
- Logout button in header

#### Features:
- Upload button shows different text based on image state:
  - "Upload Photo" (no image)
  - "Change Photo" (has image)
- Remove photo option when image exists
- Loading indicator during upload
- Error messages for failed operations
- Emoji icons for intuitive actions (📷 🖼️)

---

## 🧪 Testing Checklist

### Registration Flow
- [ ] All fields required validation
- [ ] Email format validation
- [ ] Phone number validation
- [ ] Password length validation (min 6 chars)
- [ ] Password confirmation match
- [ ] Duplicate email handling
- [ ] Success redirect to login
- [ ] Error message display

### Login Flow
- [ ] Empty field validation
- [ ] Incorrect credentials handling
- [ ] Successful login redirect
- [ ] Token storage in localStorage
- [ ] User data storage in localStorage

### Profile Page
- [ ] Protected route enforcement
- [ ] User data display from localStorage
- [ ] Profile image persistence across sessions
- [ ] Logout functionality
- [ ] Redirect after logout

### Camera Capture
- [ ] Permission request prompt
- [ ] Permission denied handling
- [ ] No camera device handling
- [ ] Image capture quality
- [ ] Camera stream cleanup after capture
- [ ] Image display after capture
- [ ] Save to storage success

### File Upload
- [ ] File picker opens correctly
- [ ] Image file type validation
- [ ] File size validation (5MB max)
- [ ] Non-image file rejection
- [ ] Image preview after upload
- [ ] Save to storage success

### Cross-Platform
- [ ] macOS camera permission prompt
- [ ] Windows camera permission prompt
- [ ] Linux camera access
- [ ] File picker on all platforms
- [ ] localStorage persistence
- [ ] Image display consistency

---

## 📦 Build and Distribution

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Platform-Specific Builds

#### macOS
```bash
npm run build
# Generates: dist/YourApp.dmg
```

**Important**: Add camera permission descriptions in `electron-builder.json5`

#### Windows
```bash
npm run build
# Generates: dist/YourApp Setup.exe
```

**Note**: No special permissions needed in manifest

#### Linux
```bash
npm run build
# Generates: dist/YourApp.AppImage
```

---

## 🔧 Configuration Files

### electron-builder.json5
Updated to include macOS camera permissions:

```json5
{
  "mac": {
    "extendInfo": {
      "NSCameraUsageDescription": "This app requires access to the camera to capture profile pictures.",
      "NSMicrophoneUsageDescription": "This app requires access to the microphone."
    }
  }
}
```

### package.json
Added dependency:
```json
{
  "dependencies": {
    "react-router-dom": "^6.x.x"
  }
}
```

---

## 🚀 Future Enhancements

### Recommended Improvements

1. **Image Optimization**
   - Compress images before storage
   - Generate thumbnails
   - Use WebP format for better compression

2. **Cloud Storage Integration**
   - AWS S3 / Azure Blob Storage
   - CDN for image delivery
   - Automatic backups

3. **Advanced Features**
   - Image cropping/editing before upload
   - Multiple profile pictures
   - Image filters and effects
   - Drag-and-drop upload

4. **Security Enhancements**
   - JWT token refresh mechanism
   - Secure token storage (not in localStorage)
   - CSRF protection
   - Rate limiting on uploads

5. **Performance Optimizations**
   - Lazy loading of images
   - Progressive image loading
   - Image caching strategies
   - Background upload with retry

6. **User Experience**
   - Progress bar for uploads
   - Image upload history
   - Batch upload support
   - Webcam preview before capture

---

## 📚 Additional Resources

### Documentation Links
- [Electron Documentation](https://www.electronjs.org/docs/latest)
- [React Router Documentation](https://reactrouter.com/en/main)
- [MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)
- [File API](https://developer.mozilla.org/en-US/docs/Web/API/File)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

### Related Topics
- JWT Authentication
- Electron IPC Communication
- Native File Dialogs
- Image Processing in JavaScript
- Canvas API for Image Manipulation

---

## 💡 Tips and Best Practices

1. **Always validate user input** on both client and server
2. **Store sensitive data securely** (never in localStorage for production)
3. **Handle all error cases gracefully** with user-friendly messages
4. **Test camera/file permissions** on all target platforms before release
5. **Optimize images** before storage to save space and improve performance
6. **Implement proper authentication** with JWT and refresh tokens
7. **Add loading states** for all async operations
8. **Use TypeScript** for type safety and better developer experience

---

## 🐛 Troubleshooting

### Camera Not Working

**macOS**:
- Check System Settings → Privacy & Security → Camera
- Ensure your app is listed and enabled
- Rebuild the app if permission description was added

**Windows**:
- Check Settings → Privacy → Camera
- Enable "Allow desktop apps to access your camera"

**Linux**:
- Check if user is in 'video' group: `groups $USER`
- Add to video group: `sudo usermod -a -G video $USER`
- Restart session after adding to group

### Images Not Persisting

- Check browser's localStorage quota (usually 5-10MB)
- Clear localStorage if corrupted: `localStorage.clear()`
- Verify user ID is correctly stored
- Check browser console for errors

### Routes Not Working

- Ensure React Router is properly installed
- Check that BrowserRouter wraps the entire app
- Verify all route paths are correct
- Check browser console for routing errors

---

## 📞 Support

For issues or questions:
1. Check this documentation first
2. Review error messages in browser console
3. Check Electron main process logs
4. Verify API endpoints are working
5. Test on a clean localStorage state

---

**Document Version**: 1.0.0  
**Last Updated**: 2024  
**Maintained By**: Development Team

