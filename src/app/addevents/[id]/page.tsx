 "use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
 

const AddEventForm = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [eventphoto, setEventPhoto] = useState<File | null>(null);
  const [startdate, setStartDate] = useState("");
  const [enddate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [eventtype, setEventType] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: any) => {
    if (e.target.files) {
      setEventPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("eventphoto", eventphoto as Blob);
    formData.append("startdate", startdate);
    formData.append("enddate", enddate);
    formData.append("location", location);
    formData.append("eventtype", eventtype);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/event/addevents/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Event created successfully:", response.data);
      setLoading(false);
      setSuccess(true);
      router.push("/dashboard");
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        setSuccess(false);
        document.body.style.overflow = "auto";
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error("Error creating event:", error);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white text-black px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl space-y-6 bg-white p-8 rounded-2xl shadow-xl z-10 border border-black"
      >
        <h2 className="text-3xl font-semibold mb-4 text-black">Create New Event</h2>

        {[
          { label: "Name", value: name, setter: setName, type: "text" },
          { label: "Description", value: description, setter: setDescription, type: "textarea" },
          { label: "Start Date", value: startdate, setter: setStartDate, type: "datetime-local" },
          { label: "End Date", value: enddate, setter: setEndDate, type: "datetime-local" },
          { label: "Location", value: location, setter: setLocation, type: "text" },
          { label: "Event Type", value: eventtype, setter: setEventType, type: "text" },
        ].map((field, i) => (
          <div key={i}>
            <label className="block text-sm font-medium mb-1 text-black">{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              />
            ) : (
              <input
                type={field.type}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
              />
            )}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1 text-black">Event Photo</label>
          <input
            type="file"
            onChange={handleFileChange}
            required
            className="w-full text-black"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-white text-black border border-black rounded-lg font-semibold hover:bg-black hover:text-white transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>

      {/* Success Overlay */}
      {success && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-20 transition-opacity">
          <div className="text-center text-black">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold">Event Created Successfully!</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddEventForm;