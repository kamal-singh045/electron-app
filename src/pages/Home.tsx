import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { FaUpload, FaTasks, FaUser, FaCheckCircle, FaRocket, FaCloud, FaCamera } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  function fakeUploadChunk(_chunk: Blob) {
    console.log(_chunk);
    return new Promise(resolve => setTimeout(resolve, 200));
  }

  const handleFileUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    const chunkSize = 1024 * 1024; // 1MB
    const totalChunks = Math.ceil(file.size / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      // simulate upload delay
      await fakeUploadChunk(chunk);

      const progress = (i + 1) / totalChunks;
      setProgress(progress);
      // Update macOS Dock progress
      window.electron.setDockProgress(progress);
    }
    // Remove progress bar
    window.electron.setDockProgress(-1);
    setIsUploading(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProgress(0);
    }
  }

  const handleScreenshot = async () => {
    try {
      const response = await window.electron.takeScreenshot();
      console.log({ response });
      if (response.success) {
        toast.success('Screenshot captured successfully');
      } else {
        toast.error('Failed to capture screenshot');
      }
    } catch (error) {
      toast.error('Failed to capture screenshot');
      console.error(error);
    }
  };

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{greeting}, {user?.name || 'User'}! 👋</h1>
            <p className="text-white/90 text-lg">Welcome back to your productivity dashboard</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
              <FaRocket className="text-6xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/tasks"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-indigo-100 p-4 rounded-lg group-hover:bg-indigo-200 transition-colors">
              <FaTasks className="text-3xl text-indigo-600" />
            </div>
            <span className="text-gray-400">→</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">My Tasks</h3>
          <p className="text-gray-600">Manage and track your todos</p>
        </Link>

        <Link
          to="/profile"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-4 rounded-lg group-hover:bg-purple-200 transition-colors">
              <FaUser className="text-3xl text-purple-600" />
            </div>
            <span className="text-gray-400">→</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">My Profile</h3>
          <p className="text-gray-600">View and update your information</p>
        </Link>

        <div className="bg-linear-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-sm text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-4 rounded-lg">
              <FaCheckCircle className="text-3xl" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">All Set!</h3>
          <p className="text-white/90">Your account is active</p>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-pink-100 p-3 rounded-lg">
            <FaCloud className="text-2xl text-pink-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">File Upload Demo</h2>
            <p className="text-gray-600">Upload large files to see progress tracking</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* File Input */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-600 transition-colors">
            <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <span className="text-indigo-600 font-medium hover:underline">
                Click to select a file
              </span>
              <span className="text-gray-600"> or drag and drop</span>
            </label>
            {file && (
              <div className="mt-4 text-sm">
                <p className="text-gray-800 font-medium">Selected: {file.name}</p>
                <p className="text-gray-600">Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Upload Progress</span>
                <span className="text-indigo-600 font-semibold">{Math.round(progress * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-linear-to-r from-indigo-600 to-purple-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            className="w-full bg-indigo-600 text-white px-6 py-4 rounded-xl hover:bg-indigo-700 transition-colors font-medium text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={handleFileUpload}
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <FaUpload />
                <span>Upload File</span>
              </>
            )}
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            💡 <strong>Tip:</strong> This demo showcases chunked file upload with progress tracking.
            The progress bar is also reflected in your macOS Dock icon!
          </p>
        </div>
      </div>

      {/* Screenshot Section */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 p-3 rounded-lg">
            <FaCamera className="text-2xl text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Screenshot Tool</h2>
            <p className="text-gray-600">Capture screenshots with a single click</p>
          </div>
        </div>
        
        <button
          onClick={handleScreenshot}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-colors font-medium text-lg"
        >
          <FaCamera />
          <span>Take Screenshot</span>
        </button>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            💡 <strong>Tip:</strong> Click the button above to capture a screenshot of your entire screen.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span className="text-2xl">✨</span>
            Beautiful Design
          </h3>
          <p className="text-gray-600">
            Modern, clean interface with smooth animations and gradients
          </p>
        </div>

        <div className="bg-linear-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            Fast & Responsive
          </h3>
          <p className="text-gray-600">
            Built with React and Electron for native-like performance
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
