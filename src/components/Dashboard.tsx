 'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const Dashboard = () => {
  const router = useRouter();
  const [clubs, setClubs] = useState<any[]>([]);



    useEffect(() =>{
      const token = localStorage.getItem('accessToken')
      if (!token) {
        router.push('/signup')
      }
    },[])

  const handle = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('No access token found in local storage');
      return;
    }

    try {
      const response = await axios.get('http://localhost:8000/club/getclub', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('response here', response.data.data);
      setClubs(response.data.data);
    } catch (error: any) {
      console.error('Error fetching clubs:', error.message);
    }
  };

  useEffect(() => {
    handle();
  }, []);

  const handleClick = () => {
    router.push('/createclub');
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-black">Clubs</h1>
        <button
          onClick={handleClick}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all"
        >
          Create Club
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {clubs.map((club: any) => (
          <div
            key={club._id}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-black mb-4">{club.name}</h2>
            <p className="text-gray-800 mb-3">{club.description}</p>
            <p className="text-sm text-gray-500">Created by: {club.admin?.username || 'Unknown'}</p>
            <p className="text-sm text-gray-400 mb-4">Events: {club.events?.length || 0}</p>

            <div className="flex gap-4 mt-4">
              <Link href={`/addevents/${club._id}`}>
                <button className="w-full bg-black text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-800 transition-all">
                  Add Events
                </button>
              </Link>

              <Link href='/allevents'>
                <button className="w-full bg-black text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-800 transition-all">
                  See Events
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
