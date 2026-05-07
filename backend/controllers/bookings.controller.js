import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js"
import cloudinary from "../utils/cloudinary.js"
import { Room } from "../models/room.model.js"
import {Booking} from "../models/booking.model.js"
import moment from "moment"

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('user').populate('room').sort({ createdAt: -1 }); 
        if (!bookings.length) {
          return res.status(404).json({
            message: "No Bookings available",
            success: false
          });
        }
        return res.status(200).json({
          bookings,
          success: true
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          message: "Server error",
          success: false
        });
      }
}

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.id;

    const myBookings = await Booking.find({ user: userId }).populate('user').populate('room').sort({ createdAt: -1 }); 

    if (!myBookings.length) {
      return res.status(404).json({
        message: "No Bookings available for this user",
        success: false
      });
    }

    return res.status(200).json({
      myBookings,
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};

export const updateStatus = async (req, res) => {  
  try {
    const {bookingId, roomId} = req.body;
    console.log(bookingId, roomId);
    
  const bookingItem = await Booking.findById(bookingId)
  if(!bookingItem){
    return res.status(404).json({
        message: "Booking not found",
        success: false
    })
  }
  bookingItem.status = 'cancelled';
  await bookingItem.save();

  const room = await Room.findById(roomId)
  const bookings = room.currentBookings
  const temp = bookings.filter(booking => booking.bookingId.toString()!= bookingId )
  room.currentBookings = temp;
  await room.save()


  return res.status(200).json({
    message: "Booking Cancelled Successfully",
    success: true,
})

  } catch (error) {
    console.log(error);
  }
}


export const createBookingRequest = async (req, res) => {
  try {
    const { roomId, startDate, endDate } = req.body;
    const userId = req.id;

    if (!roomId || !startDate || !endDate) {
      return res.status(400).json({ message: "Required fields are missing", success: false });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found", success: false });
    }

    // Check room availability for the selected dates
    const availabilityConflict = room.availability.some(
      (availability) =>
        new Date(startDate) < new Date(availability.endDate) &&
        new Date(endDate) > new Date(availability.startDate) &&
        availability.booked
    );

    if (availabilityConflict) {
      return res.status(400).json({ message: "Room is already booked for the selected dates", success: false });
    }

    // Create a booking request
    const booking = new Booking({
      room: roomId,
      user: userId,
      checkInDate: startDate,
      checkOutDate: endDate,
    });

    await booking.save();
    res.status(201).json({ message: "Booking request created", booking, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// Function to confirm the booking (Admin's side) and actually book the room
export const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found", success: false });
    }

    const room = await Room.findById(booking.room);
    if (!room) {
      return res.status(404).json({ message: "Room not found", success: false });
    }

    // Update the room availability for the confirmed dates
    (room.availability || []).forEach((availability) => {
      if (
        new Date(booking.checkInDate) >= new Date(availability.startDate) &&
        new Date(booking.checkOutDate) <= new Date(availability.endDate)
      ) {
        availability.booked = true;
      }
    });

    await room.save();

    // Update the booking status to "confirmed"
    booking.status = 'confirmed';
    await booking.save();

    res.status(200).json({ message: "Booking confirmed", booking, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const bookRoom = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate, totalAmount, totalDays } = req.body;
    const userId = req.id;

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({ message: "Required fields are missing", success: false });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found", success: false });
    }

    const booking = new Booking({
      room: roomId,
      user: userId,
      checkInDate: moment(checkInDate).format('DD-MM-YYYY') ,
      checkOutDate: moment(checkOutDate).format('DD-MM-YYYY'),
      totalAmount,
      totalDays,
      transactionId: '1234',
    });

    await booking.save();
    res.status(201).json({ message: "Booking request created", booking, success: true });

    room.currentBookings.push({ 
      bookingId: booking._id, 
      checkInDate: moment(checkInDate).format('DD-MM-YYYY'), 
      checkOutDate: moment(checkOutDate).format('DD-MM-YYYY') ,
      userId: userId,
      status: booking.status,
    })

    await room.save() 

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
