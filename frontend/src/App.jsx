import { useState } from 'react'
import Navbar from './components/shared/Navbar'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/auth/Login'
import SignUp from './components/auth/SignUp'
import Home from './components/Home'
import Profile from './components/ui/Profile'
import Admin from './components/admin/Admin'
import Booking from './components/ui/Booking'
import CreateRoom from './components/admin/CreateRoom'
import Rooms from './components/admin/Rooms'
import Room from './components/admin/Room'
import Success from './components/ui/Success'
import ManageBookings from './components/admin/ManageBookings'
import RoomDetail from './components/ui/RoomDetail'
import BookRooms from './components/ui/BookRooms'
import Contact from './components/ui/Contact'
import ManageQueries from './components/admin/manageQueries'

const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<Home />
  },
  {
    path:'/login',
    element:<Login />
  },
  {
    path:'/signup',
    element:<SignUp />
  },
  {
    path:'/Rooms',
    element:<BookRooms />
  },
  {
    path:'/profile',
    element:<Profile />
  },
  {
    path:'/myBookings',
    element:<Booking />
  },
  {
    path: '/success',
    element: <Success />
  },
  {
    path: '/room/details',
    element: <RoomDetail />
  },
  {
    path: '/contact',
    element: <Contact />
  },


  // admin routes
  {
    path: '/admin',
    element: <Admin />
  },
  {
    path: '/create/room',
    element: <CreateRoom />
  },
  {
    path: '/browse/rooms',
    element: <Rooms />
  },
  {
    path: '/browse/room',
    element: <Room />
  },
  {
    path: '/manage/bookings',
    element: <ManageBookings />
  },
  {
    path: '/manage/queries',
    element: <ManageQueries />
  },
  

])

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <RouterProvider router={appRouter} />
    </>
  )
}

export default App
