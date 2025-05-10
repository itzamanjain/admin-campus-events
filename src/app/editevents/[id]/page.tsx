 "use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventtype, setEventtype] = useState("");
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("description", description);
    formdata.append("location", location);
    formdata.append("eventtype", eventtype);
    formdata.append("startdate", startdate);
    formdata.append("enddate", enddate);

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/event/editevent/${id}`,
      formdata,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setLoading(false);
    console.log("response", response.data.data);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl p-8 bg-zinc-900 rounded-2xl shadow-lg border border-zinc-700">
        <h2 className="text-3xl font-semibold mb-6 text-center">Edit Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Event Name</label>
            <input
              type="text"
              placeholder="Enter event name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              placeholder="Enter event description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Start Date & Time</label>
              <input
                type="datetime-local"
                value={startdate}
                onChange={(e) => setStartdate(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">End Date & Time</label>
              <input
                type="datetime-local"
                value={enddate}
                onChange={(e) => setEnddate(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Location</label>
            <input
              type="text"
              placeholder="Enter event location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Event Type</label>
            <input
              type="text"
              placeholder="Enter event type"
              value={eventtype}
              onChange={(e) => setEventtype(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition duration-200"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
