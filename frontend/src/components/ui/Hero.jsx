import { setSearchData } from '@/redux/roomSlice';
import React, { useState, useRef } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const images = [
    'https://ramadaencorebareilly.com/wp-content/uploads/2024/07/Day-Use-room-in-Bareilly-Ramada-Encore-Bareilly-hotel.jpg',
    'https://dq5r178u4t83b.cloudfront.net/wp-content/uploads/sites/125/2021/08/11060441/deluxe_harbour_web.jpg',
    'https://media.cnn.com/api/v1/images/stellar/prod/140127103345-peninsula-shanghai-deluxe-mock-up.jpg?q=w_2226,h_1449,x_0,y_0,c_fill',
    'https://cf.bstatic.com/xdata/images/hotel/max1024x768/508100158.jpg?k=f280d44e9c3b1300dbca2fb2d8931345642c50146189519266ddbaaa8d452abc&o=&hp=1',
];

const Hero = () => {
  const [heroImage, setHeroImage] = useState(images[0]); // Default hero image
  const heroSectionRef = useRef(null); // Ref to scroll to the hero section
  const navigate = useNavigate()
  const dispatch = useDispatch();


  const handleImageClick = (image) => {
    setHeroImage(image); // Update hero image on click

    // Scroll to hero section smoothly
    if (heroSectionRef.current) {
      heroSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  const goToRooms = () => {
    navigate('/rooms')
    dispatch(setSearchData({ startDate: "", endDate: "" }));
  }

  return (
    <div>
      {/* Hero Section */}
      <div 
        ref={heroSectionRef}
        className="relative w-full z-10 h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex justify-center items-center text-white text-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to <span className='text-yellow-400' >Stay</span> Ease</h1>
            <p className="text-xl md:text-2xl mb-6">Your comfort is our priority</p>
            <button onClick={goToRooms} className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-md hover:bg-opacity-80 transition duration-300">
              Book Room
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg cursor-pointer"
            onClick={() => handleImageClick(image)} // Set hero image on click and scroll to hero
          >
            <img 
              src={image} 
              alt={`Gallery ${index + 1}`} 
              className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110" 
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Hero;
