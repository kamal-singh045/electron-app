import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaCamera } from "react-icons/fa";
import { toast } from 'react-toastify';

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateUser } = useAuth();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null); // Ref to hold the MediaStream
  const [cameraLoading, setCameraLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleOpenCamera = async () => {
    setShowUploadOptions(false);
    setCameraLoading(true);
    setError('');

    try {
      // Request camera permissions and capture BEFORE showing modal
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      streamRef.current = stream;

      // Only show modal after we have the stream
      setShowCameraModal(true);
      setTimeout(() => {
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.play().catch(err => console.error('Camera play error:', err));
        }
      }, 400);

    } catch (err) {
      console.error('Camera error:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera access is blocked. Go to System Settings → Privacy & Security → Camera and enable it for this app.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found on this device.');
        } else {
          setError('Failed to access camera: ' + err.message);
        }
      }
    } finally {
      setCameraLoading(false);
    }
  };

  const handleCaptureImage = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const blob: Blob = await new Promise<Blob>(resolve =>
      canvas.toBlob(b => resolve(b!), 'image/jpeg', 0.85)
    );
    const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    closeCamera();
  }

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

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setShowCameraModal(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-5">
      <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8 pb-5 border-b-2 border-gray-100">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold transition-colors hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="p-3 mb-5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-10">
          <div className="flex flex-col items-center gap-5">
            <div className="relative w-36 h-36 rounded-full border-4 border-indigo-500 shadow-lg">
              {(imagePreview || user.profile_image) ? (
                <img
                  src={imagePreview || user.profile_image}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-5xl font-bold text-white">
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <button
                onClick={() => setShowUploadOptions(!showUploadOptions)}
                className="absolute right-0 bottom-0 bg-indigo-600 border border-white rounded-full p-2.5 text-white hover:bg-indigo-700 transition-colors"
              >
                <FaCamera />
              </button>
            </div>

            <div className="flex flex-col items-center gap-2.5 relative">
              {loading && (
                <div className="text-gray-600 text-sm">Uploading...</div>
              )}
              {imagePreview && (
                <button
                  onClick={saveProfileImage}
                  className="px-6 py-2.5 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  Upload
                </button>
              )}

              {showUploadOptions && (
                <div className="flex flex-col gap-2 mt-2.5 bg-white border-2 border-gray-200 rounded-lg p-2.5 shadow-lg absolute top-full z-10 min-w-50">
                  <button
                    onClick={handleOpenCamera}
                    className="px-4 py-3 bg-white text-gray-800 border border-gray-200 rounded-md text-sm transition-all hover:bg-gray-50 hover:border-indigo-500 text-left whitespace-nowrap"
                  >
                    📷 Take Photo
                  </button>
                  <button
                    onClick={handleFileSelect}
                    className="px-4 py-3 bg-white text-gray-800 border border-gray-200 rounded-md text-sm transition-all hover:bg-gray-50 hover:border-indigo-500 text-left whitespace-nowrap"
                  >
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

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </label>
              <p className="text-base text-gray-800 font-medium">{user.name}</p>
            </div>

            <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </label>
              <p className="text-base text-gray-800 font-medium">{user.email}</p>
            </div>

            <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Phone
              </label>
              <p className="text-base text-gray-800 font-medium">{user.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {showCameraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-999">
          <div className="bg-white p-4 rounded-lg">
            {cameraLoading && (
              <div className="flex items-center justify-center">Loading...</div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              width={640}
              height={480}
              className="rounded-lg"
            />

            <div className="flex justify-between items-center mt-4">
              <button
                className="bg-indigo-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-indigo-700 transition-colors"
                onClick={handleCaptureImage}
              >
                📸 Capture
              </button>
              <button
                className="bg-transparent text-gray-800 rounded-lg border border-gray-800 px-4 py-2 font-semibold hover:bg-gray-100 transition-colors"
                onClick={closeCamera}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
