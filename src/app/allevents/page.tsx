 "use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, Tag, Edit } from "lucide-react";

const Page = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("all");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/event/getevents`);
      setEvents(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch events", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Get unique event types for filter
  const eventTypes = ["all", ...new Set(events.map((event) => event.eventtype))];

  // Format date in a more readable way
  const formatDate = (dateString : any) => {
    const options = { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options as any);
  };
  
  // Filter events based on selected type
  const filteredEvents = filter === "all" 
    ? events 
    : events.filter(event => event.eventtype === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Upcoming Events</h1>
          <p className="text-indigo-100 text-lg">Discover and manage exciting events happening near you</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <span className="font-medium text-gray-700">Filter by type:</span>
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === type
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Event count */}
            <p className="text-gray-600 mb-6">
              Showing {filteredEvents.length} {filter !== "all" ? filter : ""} events
            </p>

            {/* Events grid */}
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event) => (
                  <div
                    key={event._id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative">
                      <img
                        src={event.eventphoto || "/api/placeholder/400/200"}
                        alt={event.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {event.eventtype}
                      </div>
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-3">{event.name}</h2>
                      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-gray-600">
                          <MapPin size={16} className="mr-2 text-indigo-600" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar size={16} className="mr-2 text-indigo-600" />
                          <span>{formatDate(event.startdate)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock size={16} className="mr-2 text-indigo-600" />
                          <span>to {formatDate(event.enddate)}</span>
                        </div>
                      </div>
                      
                      <Link href={`/editevents/${event._id}`}>
                        <button className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                          <Edit size={16} className="mr-2" />
                          Edit Event
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">No events found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Page;