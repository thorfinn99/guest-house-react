import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    roomType: "",
    roomImage: null,
    roomName: "",
    roomDescription: "",
    roomRent: "", // Updated variable
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, roomImage: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("roomType", formData.roomType);
    data.append("roomImage", formData.roomImage);
    data.append("roomName", formData.roomName);
    data.append("roomRent", formData.roomRent); // Updated key
    data.append("roomDescription", formData.roomDescription);

    setLoading(true);
    try {
      console.log(data);

      const response = await axios.post(
        `${ROOM_API_END_POINT}/add`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      console.log("Response:", response.data);
      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div>
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Create a Room
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Room Name Field */}
            <div>
              <label
                htmlFor="roomName"
                className="block text-sm font-medium text-gray-700"
              >
                Room Name
              </label>
              <input
                type="text"
                id="roomName"
                name="roomName"
                value={formData.roomName}
                onChange={handleInputChange}
                placeholder="Enter room name"
                className="w-full px-4 py-2 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Room Description Field */}
            <div>
              <label
                htmlFor="roomDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Room Description
              </label>
              <textarea
                id="roomDescription"
                name="roomDescription"
                value={formData.roomDescription}
                onChange={handleInputChange}
                placeholder="Enter room description"
                rows="4"
                className="w-full px-4 py-2 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Room Type Field */}
            <div>
              <label
                htmlFor="roomType"
                className="block text-sm font-medium text-gray-700"
              >
                Room Type
              </label>
              <select
                id="roomType"
                name="roomType"
                value={formData.roomType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select Room Type
                </option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="family">Family</option>
              </select>
            </div>

            {/* Rent Per Day Field */}
            <div>
              <label
                htmlFor="roomRent"
                className="block text-sm font-medium text-gray-700"
              >
                Rent Per Day
              </label>
              <input
                type="number"
                id="roomRent"
                name="roomRent"
                value={formData.roomRent} // Updated variable
                onChange={handleInputChange}
                placeholder="Enter rent per day"
                className="w-full px-4 py-2 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Room Image Upload */}
            <div>
              <label
                htmlFor="roomImage"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Room Picture
              </label>
              <input
                type="file"
                id="roomImage"
                name="roomImage"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div>
              {loading ? (
                <button
                  type="button"
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md flex justify-center items-center"
                  disabled
                >
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Processing...
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Create Room
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
