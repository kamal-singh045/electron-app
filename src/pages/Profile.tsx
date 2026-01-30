import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUploadOptions, setShowUploadOptions] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleCameraCapture = async () => {
    setShowUploadOptions(false);
    setError('');

    try {
      // Request camera permissions and capture
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });

      // Create a video element to capture the frame
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });

      // Create canvas to capture frame
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(video, 0, 0, 640, 480);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        // Stop the camera stream
        stream.getTracks().forEach(track => track.stop());

        // Save the image
        await saveProfileImage(imageData);
      }
    } catch (err) {
      console.error('Camera error:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera permission denied. Please enable camera access in system settings.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found on this device.');
        } else {
          setError('Failed to access camera: ' + err.message);
        }
      }
    }
  };

  const handleFileSelect = () => {
    setShowUploadOptions(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;

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

    // Read and convert to base64
    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageData = event.target?.result as string;
      await saveProfileImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const saveProfileImage = async (imageData: string) => {
    console.log({ imageURL: imageData });
    setLoading(true);
    try {
      setProfileImage(imageData);

      // console.log('Profile image saved successfully');
    } catch (err) {
      setError('Failed to save profile image');
      console.error('Save image error:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeProfileImage = () => {
    if (!user) return;
    setProfileImage('');
    // TODO: Remove from server via API
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>My Profile</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="profile-content">
          <div className="profile-image-section">
            <div className="profile-image-wrapper">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="profile-image" />
              ) : (
                <div className="profile-image-placeholder">
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>

            <div className="image-actions">
              <button
                onClick={() => setShowUploadOptions(!showUploadOptions)}
                className="upload-button"
                disabled={loading}
              >
                {loading ? 'Uploading...' : profileImage ? 'Change Photo' : 'Upload Photo'}
              </button>

              {profileImage && (
                <button
                  onClick={removeProfileImage}
                  className="remove-button"
                  disabled={loading}
                >
                  Remove Photo
                </button>
              )}

              {showUploadOptions && (
                <div className="upload-options">
                  <button onClick={handleCameraCapture} className="option-button">
                    📷 Take Photo
                  </button>
                  <button onClick={handleFileSelect} className="option-button">
                    🖼️ Choose from Files
                  </button>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className="profile-info">
            <div className="info-item">
              <label>Name</label>
              <p>{user.name}</p>
            </div>

            <div className="info-item">
              <label>Email</label>
              <p>{user.email}</p>
            </div>

            <div className="info-item">
              <label>Phone</label>
              <p>{user.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
