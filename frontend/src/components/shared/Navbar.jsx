import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import React, { useState } from "react";
import { LogOut, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { IoMdContacts } from "react-icons/io";
import basket from "../../../public/basket_icon.png";


function Navbar() {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menu, setMenu] = useState("home");

  const logoutHandler = async () => {
    try {
      console.log("Button clicked");
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="shadow-md p-2 px-3 ">
      <div className="flex items-center justify-between mx-2 md:mx-6 lg:mx-auto max-w-7xl h-16">
        <div>
          <Link to="/" >
            <h1 className="text-xl cursor-pointer md:text-3xl font-bold">
              <p>Stay<span className="text-orange-500"> Ease</span></p>
            </h1>
          </Link>
        </div>
        <div className="flex items-center mx-2 gap-12 h-full ">
          <ul className="flex font-normal font-bold items-center gap-2 gap-5">
            {user && user.role === "owner" ? (
              <>
                {/* Owner-specific links can go here */}
              </>
            ) : (
              <>
                <Link to="/" onClick={() => setMenu("home")} className={`relative flex items-center gap-1 ${menu === 'home' ? 'text-orange-500' : ''} hover:text-orange-500 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 after:transition-all after:duration-300 hover:after:w-full`}>
                  <IoHome />
                  <span className={`hidden md:block`}>Home</span>
                </Link>
                <Link to="/myBookings" onClick={() => setMenu("booking")} className={`relative flex ${menu === 'booking' ? 'text-orange-500' : ''} items-center gap-1 hover:text-orange-500 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 after:transition-all after:duration-300 hover:after:w-full`}>
                  <MdOutlineRestaurantMenu />
                  <span className="hidden md:block">Bookings</span>
                </Link>
                <Link to="/contact" onClick={() => setMenu("contact")} className={`relative ${menu === 'contact' ? 'text-orange-500' : ''} flex items-center gap-1 hover:text-orange-500 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-orange-500 after:transition-all after:duration-300 hover:after:w-full`}>
                  <IoMdContacts />
                  <span className="hidden md:block">Contact Us</span>
                </Link>
              </>
            )}
          </ul>

          {!user ? (
            <div>
              <div className="flex flex-wrap justify-center gap-4">
                <a className="relative" href="#">
                  <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black"></span>
                  <Link to="/login" >
                    <span className="md:text-lg text-xs relative inline-block h-full w-full rounded border-2 border-black bg-white px-1 md:px-3 py-1 font-bold text-black transition duration-100 hover:bg-yellow-400 hover:text-gray-900">
                      Login
                    </span>
                  </Link>
                </a>
              </div>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    className="rounded-full h-8 w-8 ml-1"
                    src={user?.profile?.profilePhoto}
                    alt="pfp"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="bg-white z-50 border-0 p-4 shadow-md outline-0 w-80">
                <div className="flex items-center gap-3">
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      className="w-9 h-9 rounded-lg"
                      src={user?.profile?.profilePhoto}
                      alt="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    />
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{user.fullName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.profile?.bio}
                    </p>
                  </div>
                </div>
                <div className="flex pt-2 gap-10">
                  <div className="flex">
                    <Link to="/myBookings">
                      <div className="relative p-1 flex gap-2 text-black hover:text-gray-400 cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-gray-400 before:origin-center before:h-[1px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-gray-400 after:origin-center after:h-[1px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]">
                        <User2 />
                        <span>My Bookings</span>
                      </div>
                    </Link>
                  </div>

                  <div className="flex">
                    <div onClick={logoutHandler} className="relative p-1 flex gap-2 text-black hover:text-gray-400 cursor-pointer transition-all ease-in-out before:transition-[width] before:ease-in-out before:duration-700 before:absolute before:bg-gray-400 before:origin-center before:h-[1px] before:w-0 hover:before:w-[50%] before:bottom-0 before:left-[50%] after:transition-[width] after:ease-in-out after:duration-700 after:absolute after:bg-gray-400 after:origin-center after:h-[1px] after:w-0 hover:after:w-[50%] after:bottom-0 after:right-[50%]">
                      <LogOut />
                      <button className="text-red-500">Logout</button>
                    </div>
                  </div>

                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
