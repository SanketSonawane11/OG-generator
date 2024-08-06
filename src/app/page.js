'use client';

import axios from 'axios';
import { useState } from 'react';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post('/api/generate-image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setGeneratedImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Generate Your Image</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the title"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the content"
              required
              rows="4"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Upload file (optional):</label>
            <input
              id="image"
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer file:bg-indigo-100 file:border-0 file:text-indigo-700 hover:file:bg-indigo-200"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Generate Image
          </button>
        </form>
        {loading && <p className="mt-4 text-center text-gray-600">Loading...</p>}
        {generatedImageUrl && (
          <div className="mt-8 text-center">
            <img src={generatedImageUrl} alt="Generated Post" className="max-w-full h-auto rounded-lg shadow-lg" />
            <p className="mt-4 text-gray-800">Image URL: <br /><a href={generatedImageUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:font-semibold transition-all ease-out duration-150 hover:underline">Image available here</a></p>
          </div>
        )}
      </div>
    </div>

  );
};

export default PostForm;
