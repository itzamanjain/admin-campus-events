 'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, PlusCircle, Calendar, ExternalLink, Loader2 } from 'lucide-react';

const Page = () => {
  const router = useRouter();
  const [clubs, setClubs] = useState<any[]>([]);
  const [hasClub, setHasClub] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasclub = localStorage.getItem('hasclub');
    if (hasclub === 'true') {
      setHasClub(true);
    }
  }, []);

  const handle = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('No access token found in local storage');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/club/getclub`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('response here', response.data.data);
      setClubs(response.data.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching clubs:', error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    handle();
  }, []);

  const handleClick = () => {
    router.push('/createclub');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Clubs</h1>
              <p className="text-purple-100">Connect with communities and discover exciting events</p>
            </div>
            {!hasClub && (
              <button
                onClick={handleClick}
                className="flex items-center bg-white text-purple-700 px-6 py-3 rounded-lg hover:bg-purple-50 transition-all shadow-md font-medium"
              >
                <PlusCircle size={18} className="mr-2" />
                Create Club
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <Loader2 size={40} className="animate-spin text-purple-600" />
              <p className="mt-4 text-gray-600">Loading clubs...</p>
            </div>
          </div>
        ) : (
          <>
            {clubs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Clubs Found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {!hasClub ? 
                    "Why not create your own club and start organizing events?" :
                    "There are no clubs available at the moment. Check back later."
                  }
                </p>
                {!hasClub && (
                  <button
                    onClick={handleClick}
                    className="inline-flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all shadow-md font-medium"
                  >
                    <PlusCircle size={18} className="mr-2" />
                    Create Club
                  </button>
                )}
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-8">Showing {clubs.length} clubs</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {clubs.map((club: any) => (
                    <div
                      key={club._id}
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative">
                        <img 
                          src={club.clubphoto || "/api/placeholder/400/200"} 
                          className="w-full h-48 object-cover" 
                          alt={club.name} 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/api/placeholder/400/200";
                          }}
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-30"></div>
                        <div className="absolute bottom-4 right-4 bg-white text-purple-600 text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {club.events?.length || 0} Events
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-3">{club.name}</h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">{club.description}</p>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-6">
                          <Users size={16} className="mr-2 text-purple-600" />
                          <span>Created by: {club.admin?.username || 'Unknown'}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Link href={`/addevents/${club._id}`} className="w-full">
                            <button className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
                              <PlusCircle size={16} className="mr-2" />
                              Add Event
                            </button>
                          </Link>

                          <Link href='/allevents' className="w-full">
                            <button className="w-full flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white font-medium py-2.5 px-4 rounded-lg transition-colors">
                              <ExternalLink size={16} className="mr-2" />
                              See Events
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Page;