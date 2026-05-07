import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js"
import cloudinary from "../utils/cloudinary.js"
import { Room } from "../models/room.model.js"
import {Booking} from "../models/booking.model.js"

export const addRoom = async (req, res) => {
    try {
        const { roomType, roomName, roomRent,  roomDescription } = req.body;
        const roomImage = req.files?.roomImage?.[0];

        if (!roomType || !roomImage || !roomName || !roomRent || !roomDescription ) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        }
        const roomImageUri = getDataUri(roomImage);
        const roomImageUpload = await cloudinary.uploader.upload(roomImageUri.content);

        const room = await Room.create({
            roomType,
            roomImage: roomImageUpload.secure_url,
            roomName, 
            roomRent,
            roomDescription
        })
        return res.status(201).json({
            message: "New Room Created",
            room,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
          });
    }
}

export const checkAvailability = async (req, res) => {
    try {
        const { roomType, startDate, endDate } = req.body;
        

        console.log('Incoming query Parameters:', { roomType, startDate, endDate });
        if(!roomType || !startDate || !endDate ){
            return res.status(400).json({ 
                message: "Required fields are missing", 
                success: false });
        }
        const rooms = await Room.find({ roomType });

        const availableRooms = rooms.filter((room) => {
            return room.availability.every((availability) => {
                const isBooked = availability.booked;
                const isOverlapping =
                    startDate <= availability.endDate && endDate >= availability.startDate;
                return !isBooked && !isOverlapping;
            });
        });
        if (availableRooms.length > 0){
            return res.status(200).json({
                message: "Rooms Are Available",
                availableRooms,
                message: true
            })
        } else {
            return res.status(404).json({ message: "No Available Rooms For The Selected Dates", startDate, endDate ,success: false })
        }

    } catch (error) {
        console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
    }
}

export const bookRooms = async (req, res)=> {
    try {
        const { roomId, startDate, endDate } = req.body;
        const userId = req.id;

        if(!roomId || !startDate || !endDate ){
            return res.status(400).json({ message: "Required fields are missing", success: false });
        }

        const room = await Room.findById(roomId);
        if (!room) { return res.status(404).json({ message: "Room not found", success: false })}
        
        const availabilityConflict = room.availability.some(
            (availability) => 
              new Date(startDate) < new Date(availability.endDate) &&
              new Date(endDate) > new Date(availability.startDate) &&
              availability.booked
          );
      
          if (availabilityConflict) {
            return res.status(400).json({ message: "Room is already booked for the selected dates", success: false });
          }
      
          // Book the room by updating the availability
          room.availability.forEach((availability) => {
            if (
              new Date(startDate) >= new Date(availability.startDate) &&
              new Date(endDate) <= new Date(availability.endDate)
            ) {
              availability.booked = true;
            }
          });
          
          await room.save();

        const booking = new Booking({
            room: roomId,
            user: userId,
            checkInDate:startDate,
            checkOutDate:endDate,
          });
          await booking.save();
          res.status(201).json({ message: "Booking request created", booking, success:true });

    } catch (error) {
        console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
    }
}

export const getAllRooms = async (req, res) => {
    try {
      const rooms = await Room.find().sort({ createdAt: -1 }); // Fetch all rooms sorted by creation date
      if (!rooms.length) {
        return res.status(404).json({
          message: "No rooms available",
          success: false
        });
      }
      return res.status(200).json({
        rooms,
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
