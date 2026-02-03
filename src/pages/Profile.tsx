import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import { useAuth } from '../hooks/useAuth';
import { FaCamera } from "react-icons/fa";
import { toast } from 'react-toastify';

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateUser } = useAuth();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
      await new Promise((resolve) => (video.onloadedmetadata = resolve));

      // Create canvas to capture frame
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0);
      stream.getTracks().forEach(track => track.stop());
      const blob: Blob = await new Promise(resolve =>
        canvas.toBlob(b => resolve(b!), 'image/jpeg', 0.85)
      );
      const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
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

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const saveProfileImage = async () => {
    if (!image) return;
    setLoading(true);
    // const formData = new FormData();
    // formData.append('file', image);
    try {
      // const response = await fetchApi<IUploadProfileResponse>({
      //   url: 'http://localhost:3001/api/user/me/upload-profile',
      //   method: 'POST',
      //   body: formData
      // });
      const response = await window.electron.uploadProfileImage(image);
      console.log(response.message);
      if (response.success) {
        toast.success('Profile picture saved successfully!');
        updateUser({ profile_image: response.data?.profile_image });
        setImagePreview(null);
      } else {
        toast.error('Failed to save profile image');
      }
    } catch (err) {
      setError('Failed to save profile image');
      console.error('Save image error:', err);
    } finally {
      setLoading(false);
    }
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
              {(imagePreview || user.profile_image) ? (
                <img src={imagePreview || user.profile_image} alt="Profile" className="profile-image" />
              ) : (
                <div className="profile-image-placeholder">
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <button
                onClick={() => setShowUploadOptions(!showUploadOptions)}
                className='profile-image-camera-icon-button'>
                <FaCamera />
              </button>
            </div>

            <div className="image-actions">
              {loading && <div className="loading">Uploading...</div>}
              {(imagePreview) && (
                <>
                  <button
                    onClick={saveProfileImage}
                    className="remove-button"
                  >
                    Upload
                  </button>
                </>
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
