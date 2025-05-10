"use client";


import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [socialLink, setSocialLink] = useState('');
  const [clubPhoto, setClubPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasclub, setHasClub] = useState(false);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setClubPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('sociallink', socialLink);
    if (clubPhoto) formData.append('clubphoto', clubPhoto);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No access token found in local storage');
        return;
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/club/addclub`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response:', response.data.data._id);
      console.log('ID:', response.data.data._id);
      

      if ( response.data.data._id && response.data) {
        localStorage.setItem('hasclub', 'true'); // Store the club creation status in local storage
        setHasClub(true);
      }


      console.log();
      
      setLoading(false);

      router.push('/dashboard'); // Redirect to dashboard after successful club creation

    } catch (error: any) {
      console.error('Error creating club:', error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white text-black rounded-2xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-black">Create Club</h2>

        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="peer w-full border-b-2 border-gray-300 bg-transparent pt-4 pb-1 focus:outline-none focus:border-black"
          />
          <label className="absolute left-0 top-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-black">
            Club Name
          </label>
        </div>

        <div className="relative">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="peer w-full border-b-2 border-gray-300 bg-transparent pt-4 pb-1 focus:outline-none focus:border-black resize-none"
          />
          <label className="absolute left-0 top-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-black">
            Description
          </label>
        </div>

        <div className="relative">
          <input
            type="url"
            value={socialLink}
            onChange={(e) => setSocialLink(e.target.value)}
            required
            className="peer w-full border-b-2 border-gray-300 bg-transparent pt-4 pb-1 focus:outline-none focus:border-black"
          />
          <label className="absolute left-0 top-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-black">
            Social Link
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-700">Upload Club Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-white hover:file:text-black"
          />
          {preview && (
            <img src={preview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-md hover:bg-white hover:text-black border-2 border-black transition duration-200"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Club'}
        </button>
      </form>
    </div>
  );
};

export default Page;