import { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  function fakeUploadChunk(_chunk: Blob) {
    console.log(_chunk);
    return new Promise(resolve => setTimeout(resolve, 200));
  }

  const handleFileUpload = async () => {
    if (!file) return;
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
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }

  return (
    <div className="h-dvh bg-white">
      <h1>Home</h1>
      <div className="bg-blue-100 p-4">
        <h3 className="text-black">Upload large file to see progress bar</h3>
        <div className="flex gap-2 flex-col items-start mt-4">
          <span>Progress: {progress * 100}%</span>
          <input type="file" className="border-2 border-black p-2 rounded-md" onChange={handleFileChange} />
          <button className="bg-red-500 p-2 rounded-md text-white" onClick={handleFileUpload}>Upload</button>
        </div>
      </div>
      <Link className="italic" to={"/profile"} >Profile</Link>
    </div>
  );
};

export default Home;
