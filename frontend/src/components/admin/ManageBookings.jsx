import React from 'react';
import { useSelector } from 'react-redux';
import useGetAllBookings from '@/hooks/useGetAllBookings';
import { useNavigate } from 'react-router-dom';
import { BsThreeDotsVertical } from "react-icons/bs";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { GiConfirmed } from "react-icons/gi";
import { MdCancel } from "react-icons/md";
import { setLoading } from '@/redux/authSlice';
import axios from 'axios';
import { BOOKING_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import Navbar from '../shared/Navbar';

const ManageBookings = () => {
  useGetAllBookings();
  const { bookings } = useSelector((store) => store.booking);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const viewDetails = (room) => {
    navigate('/room/details', { state: { room } });
  };

  const confirmBooking = async (bookingId, startDate, endDate, roomId) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${BOOKING_API_END_POINT}/confirm/${bookingId}`,
        { roomId, startDate, endDate },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Booking Confirmed");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const rejectBooking = async (bookingId) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BOOKING_API_END_POINT}/update/${bookingId}/status`, { status: 'cancelled' }, { withCredentials: true });
      if (res.data.success) {
        toast.success("Booking Cancelled");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const DownloadLink = ({ url }) => {
    const downloadFile = () => {
      const link = document.createElement("a");
      link.href = url;
      link.download = url.split("/").pop(); // Use the file name from the URL
      link.click();
    };

    return (
      <a
        href="#"
        onClick={downloadFile}
        className="text-blue-600 hover:underline font-semibold text-lg cursor-pointer"
      >
        Download Guest Aadhaar
      </a>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Manage Bookings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bookings && bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">{booking.user?.fullName || 'N/A'}</h2>
                  
                  {user?.role === 'owner' && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="text-xl text-gray-600 hover:text-black">
                          <BsThreeDotsVertical />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="bg-white shadow-md p-3 rounded-lg w-48 z-50">
                        <div className="flex flex-col gap-3">
                          <div
                            onClick={() =>
                              confirmBooking(
                                booking._id,
                                booking.checkInDate,
                                booking.checkOutDate,
                                booking.room._id
                              )
                            }
                            className="flex items-center gap-2 text-green-600 hover:text-green-700 cursor-pointer"
                          >
                            <GiConfirmed />
                            <span>Confirm Booking</span>
                          </div>
                          <div
                            onClick={() => rejectBooking(booking._id)}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 cursor-pointer"
                          >
                            <MdCancel />
                            <span>Cancel Booking</span>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                <div className="text-gray-600 mb-2">
                  <div>
                    <p><strong>Booked By:</strong> {booking.user?.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> {booking.user?.phoneNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <DownloadLink url={booking.user?.aadhaar} />
                  </div>
                </div>
                <div className="text-gray-600 mb-4">
                  <p><strong>Check-in:</strong> {booking.checkInDate}</p>
                  <p><strong>Check-out:</strong> {booking.checkOutDate}</p>
                </div>
                <div className={`text-center py-2 rounded-full text-sm font-medium ${ 
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600' 
                }`}>
                  <span>Status: {booking.status}</span>
                </div>
                <div className="mt-4 flex justify-center gap-6">
                  <button
                    onClick={() => viewDetails(booking.room)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-md hover:bg-gray-700 transition duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-6 text-gray-500">No bookings available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
