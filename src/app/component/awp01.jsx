"use client";

import { useState } from 'react';

export default function Awp01() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  async function handleUpload(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      setMessage('Upload successful!');
    } else {
      setMessage('Upload failed.');
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl mb-4">Upload a File to S3</h1>

      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Upload
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </main>
  );
}
